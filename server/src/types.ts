export type EnvironmentType =
  | 'twilight_zone'
  | 'abyssal_plain'
  | 'hadal_trench'
  | 'hydrothermal_vents'
  | 'underwater_canyon'
  | 'open_deep_sea_habitat'

export type LightAvailability =
  | 'none'
  | 'bioluminescence_only'
  | 'weak_residual'
  | 'geothermal_glow'

export type OxygenAvailability =
  | 'anoxic'
  | 'oxygen_minimum_zone'
  | 'standard_deep_water'
  | 'well_oxygenated_cold_plume'

export type FoodSource =
  | 'marine_snow'
  | 'chemosynthetic_microbes'
  | 'whale_falls_and_carrion'
  | 'predatory_ambush'
  | 'benthic_sediment_detritus'

export interface EnvironmentalInputs {
  environment: EnvironmentType
  depthMeters: number
  temperatureCelsius: number
  lightAvailability: LightAvailability
  oxygenAvailability: OxygenAvailability
  foodSource: FoodSource
}

export interface PressureMetrics {
  gaugeAtm: number
  absoluteAtm: number
  gaugeBar: number
  absoluteBar: number
  gaugeMpa: number
  absoluteMpa: number
  explanation: string
}

export interface InspirationSpecies {
  commonName: string
  scientificName: string
  keyAdaptation: string
  referenceUrl: string
  citation: string
}

export interface BioluminescenceProfile {
  present: boolean
  mechanism: string
  function: string
  wavelengthAndColor: string
}

export interface PredictedCreature {
  id: string
  name: string
  scientificName: string
  hypothetical: true
  environment: string
  environmentType: EnvironmentType
  depthMeters: number
  depthRange: string
  temperatureCelsius: number
  temperatureRange: string
  pressureMetrics: PressureMetrics
  appearance: string
  bodyPlan: string
  estimatedSize: string
  sensoryAdaptations: string
  bioluminescence: BioluminescenceProfile
  cellularAndBiochemicalAdaptations: string[]
  possibleDiet: string
  ecologicalRole: string
  biologicalRationale: string
  inspirationSpecies: InspirationSpecies[]
  uncertainties: string[]
  imagePrompt: string
  imageUrl: string | null
  imageStatus: 'generated' | 'fallback' | 'unconfigured'
  imageConceptBadge: string
  generatedAt: string
}

export interface PredictionRequest {
  inputs: Partial<EnvironmentalInputs>
  variationSeed?: number
}

export interface PredictionResponse {
  success: boolean
  creature?: PredictedCreature
  error?: string
  validationIssues?: string[]
  savedToDb?: boolean
}

export interface DocumentedSpecies {
  id: string
  slug: string
  name: string
  scientificName: string
  habitat: string
  type: string
  diet: string
  depthRange: string
  minDepthMeters?: number
  maxDepthMeters?: number
  environmentalConditions?: {
    temperatureRange?: string
    pressureRange?: string
    lightLevel?: string
    oxygenLevel?: string
  }
  biologicalAdaptations: string[]
  ecologicalRole?: string
  conservationStatus: string
  description: string
  fact: string
  imageUrl: string
  imageAttribution?: string
  sourceReferences: Array<{
    title: string
    url?: string
    citation: string
  }>
  createdAt?: string
  updatedAt?: string
}

export interface DiscoveryItem {
  discoveryId: string
  predictionId: string
  predictionSnapshot: PredictedCreature
  notes?: string
  userId?: string
  isFavorite?: boolean
  savedAt: string
}
