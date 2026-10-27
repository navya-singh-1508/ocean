import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import { connectDB, getDbStatus } from './config/db.js'
import { Species } from './models/Species.js'
import { Prediction } from './models/Prediction.js'
import { Discovery } from './models/Discovery.js'
import { User } from './models/User.js'
import { DOCUMENTED_SPECIES } from './scripts/seed.js'
import { ENVIRONMENTS } from './engine/environments.js'
import { predictCreature, validateEnvironmentalInputs } from './engine/predictor.js'
import { generateCreatureImage } from './services/imageService.js'
import {
  requireAuth,
  optionalAuth,
  signToken,
  cookieOptions,
  type AuthenticatedRequest
} from './middleware/auth.js'
import type {
  PredictionRequest,
  PredictionResponse,
  PredictedCreature,
  DiscoveryItem
} from './types.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

// Connect to MongoDB Atlas (non-blocking so server starts immediately)
connectDB()

// Enable CORS for frontend — credentials mode requires explicit origin
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (
        origin === CORS_ORIGIN ||
        /^http:\/\/(localhost|127\.0\.0\.1):(5173|5174|5175|3000|3001)$/.test(origin)
      ) {
        return callback(null, true)
      }
      return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// Body parser with size limits
app.use(express.json({ limit: '100kb' }))

// Cookie parser — required for JWT auth via HTTP-only cookies
app.use(cookieParser())

// Simple in-memory fallback stores for offline/development resiliency
const inMemoryPredictions = new Map<string, PredictedCreature>()
const inMemoryDiscoveries: DiscoveryItem[] = []

// ──────────────────────────────────────────────────────
// RATE LIMITERS
// ──────────────────────────────────────────────────────

const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_MINUTE = 90

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return next()
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a moment before sending more requests.'
    })
  }

  record.count++
  return next()
}

// Stricter rate limiter for auth endpoints (10 attempts per 15 minutes)
const authCounts = new Map<string, { count: number; resetTime: number }>()
const AUTH_WINDOW_MS = 15 * 60 * 1000
const MAX_AUTH_ATTEMPTS = 10

function authRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const record = authCounts.get(ip)

  if (!record || now > record.resetTime) {
    authCounts.set(ip, { count: 1, resetTime: now + AUTH_WINDOW_MS })
    return next()
  }

  if (record.count >= MAX_AUTH_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many attempts. Please wait 15 minutes before trying again.'
    })
  }

  record.count++
  return next()
}

// ──────────────────────────────────────────────────────
// HEALTH CHECK
// ──────────────────────────────────────────────────────

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', async (_req: Request, res: Response) => {
  const dbStatus = getDbStatus()
  let speciesCount = DOCUMENTED_SPECIES.length
  let predictionsCount = inMemoryPredictions.size
  let discoveriesCount = inMemoryDiscoveries.length
  let usersCount = 0

  if (dbStatus.connected) {
    try {
      ;[speciesCount, predictionsCount, discoveriesCount, usersCount] = await Promise.all([
        Species.countDocuments(),
        Prediction.countDocuments(),
        Discovery.countDocuments(),
        User.countDocuments()
      ])
    } catch {
      // Keep fallback counts
    }
  }

  res.json({
    status: 'ok',
    service: 'ocean-explorer-backend',
    version: '2.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    database: {
      connected: dbStatus.connected,
      state: dbStatus.stateName,
      provider: 'MongoDB Atlas',
      isPersistent: dbStatus.connected
    },
    counts: {
      species: speciesCount,
      predictions: predictionsCount,
      discoveries: discoveriesCount,
      users: usersCount
    },
    imageProvider: process.env.IMAGE_PROVIDER || 'none',
    auth: {
      enabled: dbStatus.connected,
      strategy: 'JWT (HTTP-only cookie, 7-day expiry)'
    }
  })
})

// ──────────────────────────────────────────────────────
// ENVIRONMENTS
// ──────────────────────────────────────────────────────

/**
 * GET /api/environments
 */
app.get('/api/environments', (_req: Request, res: Response) => {
  res.json({
    success: true,
    environments: Object.values(ENVIRONMENTS)
  })
})

// ──────────────────────────────────────────────────────
// SPECIES CATALOGUE
// ──────────────────────────────────────────────────────

/**
 * Documented species catalogue with filtering, search, and pagination
 * GET /api/species
 */
app.get('/api/species', async (req: Request, res: Response) => {
  try {
    const { habitat, type, search } = req.query
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '20'), 10) || 20))

    const dbStatus = getDbStatus()

    if (dbStatus.connected) {
      const query: Record<string, unknown> = {}

      if (typeof habitat === 'string' && habitat !== 'All zones' && habitat.trim()) {
        query.habitat = new RegExp(`^${habitat.trim()}$`, 'i')
      }

      if (typeof type === 'string' && type !== 'All creatures' && type.trim()) {
        query.type = new RegExp(`^${type.trim()}$`, 'i')
      }

      if (typeof search === 'string' && search.trim()) {
        const term = search.trim()
        query.$or = [
          { name: { $regex: term, $options: 'i' } },
          { scientificName: { $regex: term, $options: 'i' } },
          { habitat: { $regex: term, $options: 'i' } },
          { type: { $regex: term, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } }
        ]
      }

      const total = await Species.countDocuments(query)
      const speciesList = await Species.find(query)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return res.json({
        success: true,
        data: speciesList.map((s) => ({
          id: s._id.toString(),
          slug: s.slug,
          name: s.name,
          scientific: s.scientificName,
          scientificName: s.scientificName,
          habitat: s.habitat,
          zone: s.habitat,
          type: s.type,
          diet: s.diet,
          depth: s.depthRange,
          depthRange: s.depthRange,
          status: s.conservationStatus,
          conservationStatus: s.conservationStatus,
          description: s.description,
          fact: s.fact,
          image: s.imageUrl,
          imageUrl: s.imageUrl,
          imageAttribution: s.imageAttribution,
          environmentalConditions: s.environmentalConditions,
          biologicalAdaptations: s.biologicalAdaptations,
          ecologicalRole: s.ecologicalRole,
          sourceReferences: s.sourceReferences
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        source: 'mongodb'
      })
    }

    // In-memory fallback
    let filtered = [...DOCUMENTED_SPECIES]

    if (typeof habitat === 'string' && habitat !== 'All zones' && habitat.trim()) {
      filtered = filtered.filter((s) => s.habitat.toLowerCase() === habitat.trim().toLowerCase())
    }

    if (typeof type === 'string' && type !== 'All creatures' && type.trim()) {
      filtered = filtered.filter((s) => s.type.toLowerCase() === type.trim().toLowerCase())
    }

    if (typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q) ||
          s.habitat.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      )
    }

    const total = filtered.length
    const paginated = filtered.slice((page - 1) * limit, page * limit)

    return res.json({
      success: true,
      data: paginated.map((s) => ({
        id: s.slug,
        slug: s.slug,
        name: s.name,
        scientific: s.scientificName,
        scientificName: s.scientificName,
        habitat: s.habitat,
        zone: s.habitat,
        type: s.type,
        diet: s.diet,
        depth: s.depthRange,
        depthRange: s.depthRange,
        status: s.conservationStatus,
        conservationStatus: s.conservationStatus,
        description: s.description,
        fact: s.fact,
        image: s.imageUrl,
        imageUrl: s.imageUrl,
        imageAttribution: s.imageAttribution,
        environmentalConditions: s.environmentalConditions,
        biologicalAdaptations: s.biologicalAdaptations,
        ecologicalRole: s.ecologicalRole,
        sourceReferences: s.sourceReferences
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      source: 'in-memory-fallback'
    })
  } catch (error) {
    console.error('[API Species] Error fetching species:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve marine species catalogue.'
    })
  }
})

/**
 * Retrieve single documented species by ID or slug
 * GET /api/species/:id
 */
app.get('/api/species/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Species ID is required.' })
    }

    const dbStatus = getDbStatus()

    if (dbStatus.connected) {
      let doc = null
      if (mongoose.isValidObjectId(id)) {
        doc = await Species.findById(id).lean()
      }
      if (!doc) {
        doc = await Species.findOne({ slug: id.toLowerCase().trim() }).lean()
      }

      if (doc) {
        return res.json({
          success: true,
          species: {
            id: doc._id.toString(),
            slug: doc.slug,
            name: doc.name,
            scientificName: doc.scientificName,
            habitat: doc.habitat,
            type: doc.type,
            diet: doc.diet,
            depthRange: doc.depthRange,
            environmentalConditions: doc.environmentalConditions,
            biologicalAdaptations: doc.biologicalAdaptations,
            ecologicalRole: doc.ecologicalRole,
            conservationStatus: doc.conservationStatus,
            description: doc.description,
            fact: doc.fact,
            imageUrl: doc.imageUrl,
            imageAttribution: doc.imageAttribution,
            sourceReferences: doc.sourceReferences
          }
        })
      }
    }

    const fallback = DOCUMENTED_SPECIES.find((s) => s.slug === id.toLowerCase().trim())
    if (fallback) {
      return res.json({
        success: true,
        species: {
          id: fallback.slug,
          slug: fallback.slug,
          name: fallback.name,
          scientificName: fallback.scientificName,
          habitat: fallback.habitat,
          type: fallback.type,
          diet: fallback.diet,
          depthRange: fallback.depthRange,
          environmentalConditions: fallback.environmentalConditions,
          biologicalAdaptations: fallback.biologicalAdaptations,
          ecologicalRole: fallback.ecologicalRole,
          conservationStatus: fallback.conservationStatus,
          description: fallback.description,
          fact: fallback.fact,
          imageUrl: fallback.imageUrl,
          imageAttribution: fallback.imageAttribution,
          sourceReferences: fallback.sourceReferences
        }
      })
    }

    return res.status(404).json({
      success: false,
      error: `Species not found with identifier: ${id}`
    })
  } catch (error) {
    console.error('[API Species] Error retrieving species by id:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// ──────────────────────────────────────────────────────
// AUTHENTICATION
// ──────────────────────────────────────────────────────

/**
 * Register new user account
 * POST /api/auth/register
 */
app.post('/api/auth/register', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body || {}

    // Server-side validation
    const errors: string[] = []
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters.')
    }
    if (name && name.trim().length > 100) {
      errors.push('Name must be 100 characters or fewer.')
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push('A valid email address is required.')
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      errors.push('Password must be at least 8 characters.')
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors })
    }

    const dbStatus = getDbStatus()
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Registration requires a database connection. Please configure MongoDB Atlas and try again.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.'
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = new User({ name: name.trim(), email: normalizedEmail, passwordHash })
    await user.save()

    const token = signToken(user._id.toString(), user.email, user.name)
    return res
      .cookie('ocean_token', token, cookieOptions())
      .status(201)
      .json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          favoriteSpeciesSlugs: []
        }
      })
  } catch (error) {
    console.error('[Auth] Register error:', error)
    return res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    })
  }
})

/**
 * Sign in with email and password
 * POST /api/auth/login
 */
app.post('/api/auth/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {}

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'Email and password are required.' })
    }

    const dbStatus = getDbStatus()
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Sign in requires a database connection. Please configure MongoDB Atlas and try again.'
      })
    }

    // Select passwordHash explicitly (it has select: false in schema)
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash')
    if (!user) {
      // Constant-time response to prevent email enumeration
      await bcrypt.compare(password, '$2b$12$invalidhashtopreventtimingattacks')
      return res.status(401).json({ success: false, error: 'Invalid email or password.' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' })
    }

    const token = signToken(user._id.toString(), user.email, user.name)
    return res
      .cookie('ocean_token', token, cookieOptions())
      .json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          favoriteSpeciesSlugs: user.favoriteSpeciesSlugs || []
        }
      })
  } catch (error) {
    console.error('[Auth] Login error:', error)
    return res.status(500).json({
      success: false,
      error: 'Sign in failed. Please try again.'
    })
  }
})

/**
 * Sign out — clear JWT cookie
 * POST /api/auth/logout
 */
app.post('/api/auth/logout', (_req: Request, res: Response) => {
  return res
    .clearCookie('ocean_token', cookieOptions())
    .json({ success: true, message: 'Signed out successfully.' })
})

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dbStatus = getDbStatus()
    if (!dbStatus.connected) {
      // Return JWT payload when DB is unavailable
      return res.json({
        success: true,
        user: {
          id: req.userId,
          name: req.userName,
          email: req.userEmail,
          favoriteSpeciesSlugs: []
        }
      })
    }

    const user = await User.findById(req.userId).lean()
    if (!user) {
      res.clearCookie('ocean_token', cookieOptions())
      return res.status(401).json({ success: false, error: 'Account not found.' })
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        favoriteSpeciesSlugs: user.favoriteSpeciesSlugs || []
      }
    })
  } catch (error) {
    console.error('[Auth] Me error:', error)
    return res.status(500).json({ success: false, error: 'Failed to retrieve account.' })
  }
})

// ──────────────────────────────────────────────────────
// USER FAVORITES
// ──────────────────────────────────────────────────────

/**
 * Get current user's favorite species slugs
 * GET /api/me/favorites
 */
app.get('/api/me/favorites', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dbStatus = getDbStatus()
    if (!dbStatus.connected) {
      return res.json({ success: true, favorites: [] })
    }

    const user = await User.findById(req.userId).lean()
    return res.json({
      success: true,
      favorites: user?.favoriteSpeciesSlugs || []
    })
  } catch (error) {
    console.error('[API Favorites] Error:', error)
    return res.status(500).json({ success: false, error: 'Failed to retrieve favorites.' })
  }
})

/**
 * Add or remove a favorite species
 * POST /api/me/favorites
 * body: { slug: string, action: 'add' | 'remove' }
 */
app.post('/api/me/favorites', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { slug, action } = req.body || {}

    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Species slug is required.' })
    }

    const dbStatus = getDbStatus()
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Syncing favorites requires database connectivity.'
      })
    }

    const update =
      action === 'remove'
        ? { $pull: { favoriteSpeciesSlugs: slug.trim() } }
        : { $addToSet: { favoriteSpeciesSlugs: slug.trim() } }

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).lean()

    return res.json({
      success: true,
      favorites: user?.favoriteSpeciesSlugs || []
    })
  } catch (error) {
    console.error('[API Favorites] Toggle error:', error)
    return res.status(500).json({ success: false, error: 'Failed to update favorites.' })
  }
})

// ──────────────────────────────────────────────────────
// DEEP SEA CREATURE PREDICTOR
// ──────────────────────────────────────────────────────

/**
 * Generate hypothetical creature prediction
 * POST /api/predict
 */
app.post('/api/predict', rateLimiter, async (req: Request, res: Response) => {
  try {
    const body = (req.body || {}) as PredictionRequest
    const rawInputs = body.inputs || {}
    const seed =
      typeof body.variationSeed === 'number'
        ? body.variationSeed
        : Math.floor(Math.random() * 1000000)

    const validation = validateEnvironmentalInputs(rawInputs)
    if (!validation.valid && validation.errors.length > 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid environmental parameters submitted.',
        validationIssues: validation.errors
      })
    }

    const prediction = predictCreature(rawInputs, seed)

    if (!prediction.creature) {
      return res.status(500).json({
        success: false,
        error: 'Prediction engine failed to synthesize a creature profile.'
      })
    }

    const imageResult = await generateCreatureImage(prediction.creature)
    prediction.creature.imageUrl = imageResult.imageUrl
    prediction.creature.imageStatus = imageResult.status
    prediction.creature.imageConceptBadge = imageResult.badge

    let savedToDb = false
    const dbStatus = getDbStatus()

    if (dbStatus.connected) {
      try {
        const newPrediction = new Prediction({
          predictionId: prediction.creature.id,
          name: prediction.creature.name,
          scientificName: prediction.creature.scientificName,
          hypothetical: true,
          environment: prediction.creature.environment,
          environmentType: prediction.creature.environmentType,
          depthMeters: prediction.creature.depthMeters,
          depthRange: prediction.creature.depthRange,
          temperatureCelsius: prediction.creature.temperatureCelsius,
          temperatureRange: prediction.creature.temperatureRange,
          pressureMetrics: prediction.creature.pressureMetrics,
          appearance: prediction.creature.appearance,
          bodyPlan: prediction.creature.bodyPlan,
          estimatedSize: prediction.creature.estimatedSize,
          sensoryAdaptations: prediction.creature.sensoryAdaptations,
          bioluminescence: prediction.creature.bioluminescence,
          cellularAndBiochemicalAdaptations: prediction.creature.cellularAndBiochemicalAdaptations,
          possibleDiet: prediction.creature.possibleDiet,
          ecologicalRole: prediction.creature.ecologicalRole,
          biologicalRationale: prediction.creature.biologicalRationale,
          inspirationSpecies: prediction.creature.inspirationSpecies,
          uncertainties: prediction.creature.uncertainties,
          imagePrompt: prediction.creature.imagePrompt,
          imageUrl: prediction.creature.imageUrl,
          imageStatus: prediction.creature.imageStatus,
          imageConceptBadge: prediction.creature.imageConceptBadge,
          variationSeed: seed
        })
        await newPrediction.save()
        savedToDb = true
      } catch (saveErr) {
        console.warn('[API Predict] Could not persist prediction to MongoDB:', saveErr)
      }
    }

    inMemoryPredictions.set(prediction.creature.id, prediction.creature)

    const responsePayload: PredictionResponse = {
      success: true,
      creature: prediction.creature,
      savedToDb,
      validationIssues: validation.errors.length > 0 ? validation.errors : undefined
    }

    return res.json(responsePayload)
  } catch (error) {
    console.error('[API Predict] Unexpected server error:', error)
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred while generating creature prediction.'
    })
  }
})

/**
 * Retrieve prediction by ID
 * GET /api/predictions/:id
 */
app.get('/api/predictions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Prediction ID required.' })
    }

    const dbStatus = getDbStatus()

    if (dbStatus.connected) {
      const doc = await Prediction.findOne({ predictionId: id }).lean()
      if (doc) {
        return res.json({
          success: true,
          prediction: {
            id: doc.predictionId,
            name: doc.name,
            scientificName: doc.scientificName,
            hypothetical: true,
            environment: doc.environment,
            environmentType: doc.environmentType,
            depthMeters: doc.depthMeters,
            depthRange: doc.depthRange,
            temperatureCelsius: doc.temperatureCelsius,
            temperatureRange: doc.temperatureRange,
            pressureMetrics: doc.pressureMetrics,
            appearance: doc.appearance,
            bodyPlan: doc.bodyPlan,
            estimatedSize: doc.estimatedSize,
            sensoryAdaptations: doc.sensoryAdaptations,
            bioluminescence: doc.bioluminescence,
            cellularAndBiochemicalAdaptations: doc.cellularAndBiochemicalAdaptations,
            possibleDiet: doc.possibleDiet,
            ecologicalRole: doc.ecologicalRole,
            biologicalRationale: doc.biologicalRationale,
            inspirationSpecies: doc.inspirationSpecies,
            uncertainties: doc.uncertainties,
            imagePrompt: doc.imagePrompt,
            imageUrl: doc.imageUrl,
            imageStatus: doc.imageStatus,
            imageConceptBadge: doc.imageConceptBadge,
            generatedAt: doc.createdAt.toISOString()
          }
        })
      }
    }

    const mem = inMemoryPredictions.get(id)
    if (mem) {
      return res.json({ success: true, prediction: mem })
    }

    return res.status(404).json({
      success: false,
      error: `Prediction not found with ID: ${id}`
    })
  } catch (error) {
    console.error('[API Predictions] Error retrieving prediction:', error)
    return res.status(500).json({ success: false, error: 'Failed to retrieve prediction.' })
  }
})

// ──────────────────────────────────────────────────────
// DISCOVERIES JOURNAL (user-scoped with optional auth)
// ──────────────────────────────────────────────────────

/**
 * Save creature to Discoveries journal
 * POST /api/discoveries
 */
app.post('/api/discoveries', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { predictionId, creature, notes, isFavorite } = req.body || {}
    const scopedUserId = req.userId || 'guest'

    let snapshot: PredictedCreature | null = creature || null

    if (!snapshot && predictionId) {
      snapshot = inMemoryPredictions.get(predictionId) || null
      if (!snapshot && getDbStatus().connected) {
        const dbPred = await Prediction.findOne({ predictionId }).lean()
        if (dbPred) {
          snapshot = {
            id: dbPred.predictionId,
            name: dbPred.name,
            scientificName: dbPred.scientificName,
            hypothetical: true,
            environment: dbPred.environment,
            environmentType: dbPred.environmentType,
            depthMeters: dbPred.depthMeters,
            depthRange: dbPred.depthRange,
            temperatureCelsius: dbPred.temperatureCelsius,
            temperatureRange: dbPred.temperatureRange,
            pressureMetrics: dbPred.pressureMetrics,
            appearance: dbPred.appearance,
            bodyPlan: dbPred.bodyPlan,
            estimatedSize: dbPred.estimatedSize,
            sensoryAdaptations: dbPred.sensoryAdaptations,
            bioluminescence: dbPred.bioluminescence,
            cellularAndBiochemicalAdaptations: dbPred.cellularAndBiochemicalAdaptations,
            possibleDiet: dbPred.possibleDiet,
            ecologicalRole: dbPred.ecologicalRole,
            biologicalRationale: dbPred.biologicalRationale,
            inspirationSpecies: dbPred.inspirationSpecies,
            uncertainties: dbPred.uncertainties,
            imagePrompt: dbPred.imagePrompt,
            imageUrl: dbPred.imageUrl,
            imageStatus: dbPred.imageStatus as 'generated' | 'fallback' | 'unconfigured',
            imageConceptBadge: dbPred.imageConceptBadge,
            generatedAt: dbPred.createdAt.toISOString()
          }
        }
      }
    }

    if (!snapshot) {
      return res.status(400).json({
        success: false,
        error: 'Creature profile snapshot or valid predictionId is required to record a discovery.'
      })
    }

    const discoveryId = `disc-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const discoveryItem: DiscoveryItem = {
      discoveryId,
      predictionId: snapshot.id || predictionId || discoveryId,
      predictionSnapshot: snapshot,
      notes: notes || '',
      userId: scopedUserId,
      isFavorite: Boolean(isFavorite),
      savedAt: new Date().toISOString()
    }

    const dbStatus = getDbStatus()
    if (dbStatus.connected) {
      try {
        const doc = new Discovery({
          discoveryId,
          predictionId: discoveryItem.predictionId,
          predictionSnapshot: snapshot,
          notes: discoveryItem.notes,
          userId: scopedUserId,
          isFavorite: discoveryItem.isFavorite,
          savedAt: new Date()
        })
        await doc.save()
      } catch (err) {
        console.warn('[API Discoveries] Could not write discovery to MongoDB:', err)
      }
    }

    inMemoryDiscoveries.unshift(discoveryItem)

    return res.status(201).json({
      success: true,
      discovery: discoveryItem,
      message: 'Hypothetical creature recorded in field journal discoveries!'
    })
  } catch (error) {
    console.error('[API Discoveries] Error saving discovery:', error)
    return res.status(500).json({ success: false, error: 'Failed to record discovery.' })
  }
})

/**
 * Retrieve saved discoveries
 * GET /api/discoveries
 */
app.get('/api/discoveries', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '20'), 10) || 20))
    const favoriteOnly = req.query.favoriteOnly === 'true'

    const dbStatus = getDbStatus()

    if (dbStatus.connected) {
      const query: Record<string, unknown> = {}
      // Scope to authenticated user; guests see their session's discoveries only
      if (req.userId) {
        query.userId = req.userId
      } else {
        query.userId = 'guest'
      }
      if (favoriteOnly) {
        query.isFavorite = true
      }

      const total = await Discovery.countDocuments(query)
      const list = await Discovery.find(query)
        .sort({ savedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return res.json({
        success: true,
        discoveries: list.map((d) => ({
          discoveryId: d.discoveryId,
          predictionId: d.predictionId,
          predictionSnapshot: d.predictionSnapshot,
          notes: d.notes,
          userId: d.userId,
          isFavorite: d.isFavorite,
          savedAt: d.savedAt.toISOString()
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        source: 'mongodb'
      })
    }

    // In-memory fallback: scope to current user or guest
    let list = inMemoryDiscoveries.filter(
      (d) => d.userId === (req.userId || 'guest')
    )
    if (favoriteOnly) {
      list = list.filter((d) => d.isFavorite)
    }

    const total = list.length
    const paginated = list.slice((page - 1) * limit, page * limit)

    return res.json({
      success: true,
      discoveries: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      source: 'in-memory-fallback'
    })
  } catch (error) {
    console.error('[API Discoveries] Error retrieving discoveries:', error)
    return res.status(500).json({ success: false, error: 'Failed to retrieve discoveries.' })
  }
})

/**
 * Remove discovery from journal
 * DELETE /api/discoveries/:id
 */
app.delete('/api/discoveries/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Discovery ID required.' })
    }

    const dbStatus = getDbStatus()

    if (dbStatus.connected) {
      const query: Record<string, unknown> = { discoveryId: id }
      // Only allow deletion of own discoveries when authenticated
      if (req.userId) {
        query.userId = req.userId
      }

      let result = await Discovery.deleteOne(query)
      // Fallback: try MongoDB ObjectId
      if (result.deletedCount === 0 && mongoose.isValidObjectId(id)) {
        const oidQuery: Record<string, unknown> = { _id: id }
        if (req.userId) oidQuery.userId = req.userId
        result = await Discovery.deleteOne(oidQuery)
      }
    }

    // Remove from in-memory store
    const idx = inMemoryDiscoveries.findIndex(
      (d) =>
        (d.discoveryId === id || d.predictionId === id) &&
        (d.userId === (req.userId || 'guest'))
    )
    if (idx !== -1) {
      inMemoryDiscoveries.splice(idx, 1)
    }

    return res.json({
      success: true,
      message: 'Discovery removed from field journal.'
    })
  } catch (error) {
    console.error('[API Discoveries] Error deleting discovery:', error)
    return res.status(500).json({ success: false, error: 'Failed to delete discovery.' })
  }
})

// ──────────────────────────────────────────────────────
// ERROR HANDLERS
// ──────────────────────────────────────────────────────

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Consult Ocean Explorer API documentation.'
  })
})

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Express Error]', err.message)
  res.status(500).json({
    success: false,
    error: 'Internal server error.'
  })
})

app.listen(PORT, () => {
  console.log(`🌊 Ocean Explorer Backend v2.0 listening on port ${PORT}`)
  console.log(`🔗 Allowed CORS origin: ${CORS_ORIGIN}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔐 Auth endpoints: /api/auth/register, /api/auth/login, /api/auth/logout, /api/auth/me`)
})

export default app
