import type {
  Creature,
  EnvironmentalInputs,
  PredictedCreature,
  PressureMetrics,
  DiscoveryRecord
} from '../types'
import { creatures as localCreatures } from '../data'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export interface HealthCheckResult {
  connected: boolean
  status?: string
  version?: string
  imageProvider?: string
  database?: {
    connected: boolean
    state: string
    provider: string
    isPersistent: boolean
  }
  counts?: {
    species: number
    predictions: number
    discoveries: number
  }
  error?: string
}

export interface SpeciesFilterParams {
  habitat?: string
  type?: string
  search?: string
  page?: number
  limit?: number
}

export interface SpeciesResponse {
  success: boolean
  data: Creature[]
  total: number
  page: number
  totalPages: number
  source: string
}

export async function checkBackendHealth(): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: controller.signal,
      credentials: 'include'
    })
    clearTimeout(timeout)
    if (response.ok) {
      const data = await response.json()
      return {
        connected: true,
        status: data.status,
        version: data.version,
        imageProvider: data.imageProvider,
        database: data.database,
        counts: data.counts
      }
    }
    return { connected: false, error: `Backend responded with HTTP ${response.status}` }
  } catch (err) {
    return { connected: false, error: err instanceof Error ? err.message : 'Connection failed' }
  }
}

/**
 * Fetch documented marine species from backend MongoDB API
 */
export async function fetchSpecies(params?: SpeciesFilterParams): Promise<SpeciesResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/api/species`)
    if (params?.habitat && params.habitat !== 'All zones') {
      url.searchParams.set('habitat', params.habitat)
    }
    if (params?.type && params.type !== 'All creatures') {
      url.searchParams.set('type', params.type)
    }
    if (params?.search) {
      url.searchParams.set('search', params.search)
    }
    if (params?.page) {
      url.searchParams.set('page', String(params.page))
    }
    if (params?.limit) {
      url.searchParams.set('limit', String(params.limit))
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const response = await fetch(url.toString(), { signal: controller.signal, credentials: 'include' })
    clearTimeout(timeout)

    if (response.ok) {
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        return result
      }
    }
  } catch (err) {
    console.warn('[API Client] Backend species retrieval failed, falling back to local dataset:', err)
  }

  // Graceful local fallback if backend is starting or offline
  let filtered = [...localCreatures]
  if (params?.habitat && params.habitat !== 'All zones') {
    filtered = filtered.filter((c) => c.zone === params.habitat)
  }
  if (params?.type && params.type !== 'All creatures') {
    filtered = filtered.filter((c) => c.type === params.type)
  }
  if (params?.search) {
    const q = params.search.trim().toLowerCase()
    filtered = filtered.filter((c) =>
      [c.name, c.scientific, c.type, c.zone, c.description].some((v) => v.toLowerCase().includes(q))
    )
  }

  return {
    success: true,
    data: filtered,
    total: filtered.length,
    page: 1,
    totalPages: 1,
    source: 'local-fallback'
  }
}

/**
 * Fetch documented species by ID or slug
 */
export async function fetchSpeciesById(id: string): Promise<Creature | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/species/${encodeURIComponent(id)}`)
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.species) {
        return data.species
      }
    }
  } catch (err) {
    console.warn('[API Client] Error fetching species by ID:', err)
  }

  const found = localCreatures.find((c) => c.id === id)
  return found || null
}

/**
 * Request hypothetical deep-sea creature prediction from backend API
 */
export async function requestPrediction(
  inputs: EnvironmentalInputs,
  variationSeed: number = Math.floor(Math.random() * 100000)
): Promise<{ creature: PredictedCreature; isOfflineFallback?: boolean; warning?: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ inputs, variationSeed }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null)
      throw new Error(errorJson?.error || `Server responded with ${response.status}`)
    }

    const data = await response.json()
    if (!data.success || !data.creature) {
      throw new Error(data.error || 'Server returned an invalid prediction payload.')
    }

    return { creature: data.creature }
  } catch (err: unknown) {
    console.warn('[API Client] Backend prediction failed, synthesizing locally:', err)
    const fallback = synthesizeLocalFallback(inputs, variationSeed)
    return {
      creature: fallback,
      isOfflineFallback: true,
      warning: 'Backend unreachable. Synthesized via browser-resident biological engine.'
    }
  }
}

/**
 * Fetch saved discoveries from MongoDB
 */
export async function fetchDiscoveries(): Promise<DiscoveryRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/discoveries`, { credentials: 'include' })
    if (response.ok) {
      const data = await response.json()
      if (data.success && Array.isArray(data.discoveries)) {
        return data.discoveries
      }
    }
  } catch (err) {
    console.warn('[API Client] Error fetching discoveries from backend:', err)
  }
  return []
}

/**
 * Save creature to Discoveries in MongoDB
 */
export async function saveDiscovery(
  creature: PredictedCreature,
  notes: string = '',
  isFavorite: boolean = false
): Promise<DiscoveryRecord | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/discoveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        predictionId: creature.id,
        creature,
        notes,
        isFavorite
      })
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success && data.discovery) {
        return data.discovery
      }
    }
  } catch (err) {
    console.warn('[API Client] Error saving discovery to backend:', err)
  }
  return null
}

/**
 * Delete discovery from MongoDB
 */
export async function deleteDiscovery(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/discoveries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (response.ok) {
      const data = await response.json()
      return Boolean(data.success)
    }
  } catch (err) {
    console.warn('[API Client] Error deleting discovery from backend:', err)
  }
  return false
}

/**
 * Calculate physical hydrostatic pressure locally
 */
export function calculateLocalPressure(depthMeters: number): PressureMetrics {
  const clampedDepth = Math.max(0, depthMeters)
  const rho = 1026
  const g = 9.80665
  const gaugePascals = rho * g * clampedDepth

  const gaugeAtm = gaugePascals / 101325
  const absoluteAtm = gaugeAtm + 1.0
  const gaugeBar = gaugePascals / 100000
  const absoluteBar = gaugeBar + 1.01325
  const gaugeMpa = gaugePascals / 1e6
  const absoluteMpa = gaugeMpa + 0.101325

  return {
    gaugeAtm: Math.round(gaugeAtm * 10) / 10,
    absoluteAtm: Math.round(absoluteAtm * 10) / 10,
    gaugeBar: Math.round(gaugeBar * 10) / 10,
    absoluteBar: Math.round(absoluteBar * 10) / 10,
    gaugeMpa: Math.round(gaugeMpa * 100) / 100,
    absoluteMpa: Math.round(absoluteMpa * 100) / 100,
    explanation: `Gauge pressure (${Math.round(gaugeBar)} bar / ${Math.round(gaugeAtm)} atm) is the hydrostatic load of the water column. Absolute pressure (${Math.round(absoluteBar)} bar / ${Math.round(absoluteAtm)} atm) includes the 1.013 bar atmospheric pressure pressing on the sea surface.`
  }
}

function synthesizeLocalFallback(inputs: EnvironmentalInputs, seed: number): PredictedCreature {
  const pressure = calculateLocalPressure(inputs.depthMeters)
  const isHadal = inputs.depthMeters >= 6000
  const isVent = inputs.environment === 'hydrothermal_vents'
  const isTwilight = inputs.environment === 'twilight_zone'

  const scientificName = isVent
    ? 'Pyrosiphon sulfuriphila'
    : isHadal
    ? 'Piezoliparis hadaliensis'
    : isTwilight
    ? 'Tubophthalmus pelagica'
    : 'Bathystilus profundus'

  const commonName = isVent
    ? 'Sulfur Plume Siphon-Worm'
    : isHadal
    ? 'Mariana Ghost Snailfish'
    : isTwilight
    ? 'Ghost-Eye Lantern Prowler'
    : 'Tripod Silt-Strider'

  return {
    id: `unknown-fallback-${Date.now()}-${Math.abs(seed % 1000)}`,
    name: commonName,
    scientificName,
    hypothetical: true,
    environment: inputs.environment.replace(/_/g, ' ').toUpperCase(),
    environmentType: inputs.environment,
    depthMeters: inputs.depthMeters,
    depthRange: `${inputs.depthMeters} m (Load: ~${Math.round(pressure.gaugeBar)} bar)`,
    temperatureCelsius: inputs.temperatureCelsius,
    temperatureRange: `${inputs.temperatureCelsius.toFixed(1)} °C`,
    pressureMetrics: pressure,
    appearance: isVent
      ? 'Chitin-protein tubes encrusted in mineral sulfides, topped by radiant scarlet branchial filaments.'
      : isHadal
      ? 'Translucent gelatinous pinkish-white dermis exposing internal organs; non-calcified flexible skull.'
      : 'Slender metallic-scaled osteichthyan body with rigid fin rays adapted to deep currents.',
    bodyPlan: isVent
      ? 'Sessile sclerotized cylinder with vascularized plume; mouth and digestive tract absent.'
      : isHadal
      ? 'Gelatinous scaleless tadpole-like teleost with ventral suction disc.'
      : 'Slender fish with stilt-like fin ray scaffolds elevating the body above soft sediment.',
    estimatedSize: isVent ? '1.5 m tube length' : isHadal ? '24 cm length; 160 g' : '36 cm body length',
    sensoryAdaptations: isVent
      ? 'Hyper-developed chemosensory organs detecting dissolved sulfide plumes; naked dorsal infrared photoreceptors.'
      : isHadal
      ? 'Microphthalmic eyes; navigation governed by enlarged mechanosensory lateral lines and cranial pores.'
      : 'Tubular upward-pointing eyes with dual-pigment lenses and extended tactile fin rays.',
    bioluminescence: {
      present: !isVent && !isHadal,
      mechanism: isTwilight ? 'Coelenterazine-luciferase photophores' : 'None / reduced',
      function: isTwilight ? 'Ventral counterillumination camouflage' : 'Non-bioluminescent under extreme pressure',
      wavelengthAndColor: isTwilight ? '470 nm (Cyan)' : 'N/A'
    },
    cellularAndBiochemicalAdaptations: [
      `High cellular TMAO piezolyte concentration buffering cellular proteins against ${Math.round(pressure.gaugeAtm)} atm hydrostatic pressure.`,
      'Polyunsaturated fatty-acid membrane fluidity preventing cold/pressure phase transitions.',
      isVent
        ? 'Heat Shock Protein chaperones (Hsp70/90) refolding enzymes in turbulent thermal mixing boundaries.'
        : 'Metabolic enzyme reduction enabling prolonged periods of nutrient fasting.'
    ],
    possibleDiet: isVent
      ? 'Chemosynthetic sulfur-oxidizing endosymbionts housed in a vascularized trophosome.'
      : inputs.foodSource === 'marine_snow'
      ? 'Particulate organic carbon sinking from upper euphotic layers.'
      : 'Benthic detrital meiofauna and microbial sedimentary coatings.',
    ecologicalRole: isVent
      ? 'Primary producer / Symbiotic foundation species in hydrothermal rift ecosystems.'
      : 'Specialized deep-sea consumer maintaining abyssal nutrient cycling.',
    biologicalRationale: `At ${inputs.depthMeters} m depth, the organism withstands an absolute pressure of ${pressure.absoluteAtm} atm. Cellular membrane fluidity is preserved via high homeoviscous desaturase activity and TMAO osmolyte concentrations. Water temperature of ${inputs.temperatureCelsius.toFixed(1)}°C modulates enzymatic turnover rates.`,
    inspirationSpecies: [
      {
        commonName: isVent ? 'Giant Hydrothermal Tubeworm' : 'Mariana Snailfish',
        scientificName: isVent ? 'Riftia pachyptila' : 'Pseudoliparis swirei',
        keyAdaptation: isVent
          ? 'Symbiosis with sulfide-oxidizing bacteria inside trophosome tissue.'
          : 'High TMAO piezolyte levels and flexible cartilaginous skull plates.',
        referenceUrl: isVent ? 'https://www.mbari.org/animal/riftia-pachyptila/' : 'https://www.nature.com/articles/s41559-019-0864-8',
        citation: isVent ? 'Cavanaugh et al. (1981) Science' : 'Gerringer et al. (2017) Zootaxa'
      }
    ],
    uncertainties: [
      'Hypothetical prediction based on comparative morphology and known biophysical principles.',
      'Environmental variables create strong selection pressures, but do not deterministically fix external appearance.'
    ],
    imagePrompt: `Speculative deep-sea organism concept: ${scientificName} at ${inputs.depthMeters}m depth.`,
    imageUrl: null,
    imageStatus: 'fallback',
    imageConceptBadge: 'Scientific Speculative Concept (Vector Illustration)',
    generatedAt: new Date().toISOString()
  }
}
