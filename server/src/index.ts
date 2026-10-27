import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ENVIRONMENTS } from './engine/environments.js'
import { predictCreature, validateEnvironmentalInputs } from './engine/predictor.js'
import { generateCreatureImage } from './services/imageService.js'
import type { PredictionRequest, PredictionResponse } from './types.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

// Enable CORS for frontend
app.use(
  cors({
    origin: [CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// Body parser with size limits
app.use(express.json({ limit: '100kb' }))

// Simple in-memory request throttling
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60

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
      error: 'Too many requests. Please wait a moment before generating more predictions.'
    })
  }

  record.count++
  return next()
}

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ocean-explorer-predictor-backend',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    imageProvider: process.env.IMAGE_PROVIDER || 'none'
  })
})

/**
 * Metadata endpoint listing all environments
 * GET /api/environments
 */
app.get('/api/environments', (_req: Request, res: Response) => {
  res.json({
    success: true,
    environments: Object.values(ENVIRONMENTS)
  })
})

/**
 * Prediction endpoint
 * POST /api/predict
 */
app.post('/api/predict', rateLimiter, async (req: Request, res: Response) => {
  try {
    const body = (req.body || {}) as PredictionRequest
    const rawInputs = body.inputs || {}
    const seed = typeof body.variationSeed === 'number' ? body.variationSeed : Math.floor(Math.random() * 100000)

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

    // Attempt optional image generation if configured
    const imageResult = await generateCreatureImage(prediction.creature)
    prediction.creature.imageUrl = imageResult.imageUrl
    prediction.creature.imageStatus = imageResult.status
    prediction.creature.imageConceptBadge = imageResult.badge

    const responsePayload: PredictionResponse = {
      success: true,
      creature: prediction.creature,
      validationIssues: validation.errors.length > 0 ? validation.errors : undefined
    }

    return res.json(responsePayload)
  } catch (error: unknown) {
    console.error('[API Predict] Unexpected server error:', error)
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred while generating the creature prediction.'
    })
  }
})

// 404 handler for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Use GET /api/health or POST /api/predict.'
  })
})

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Express Error]', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error.'
  })
})

app.listen(PORT, () => {
  console.log(`🌊 Ocean Explorer Backend listening on port ${PORT}`)
  console.log(`🔗 Allowed CORS origin: ${CORS_ORIGIN}`)
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`)
})

export default app
