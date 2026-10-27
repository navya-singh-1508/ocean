import type {
  EnvironmentalInputs,
  PredictedCreature,
  PredictionResponse,
  EnvironmentType,
  LightAvailability,
  OxygenAvailability,
  FoodSource
} from '../types.js'
import { ENVIRONMENTS, calculatePressure } from './environments.js'
import {
  selectArchetype,
  determineCellularAdaptations,
  determineBioluminescence,
  determineSensoryAdaptations,
  selectInspirationSpecies,
  generateScientificName
} from './traits.js'

export function validateEnvironmentalInputs(inputs: Partial<EnvironmentalInputs>): {
  valid: boolean
  errors: string[]
  sanitized: EnvironmentalInputs
} {
  const errors: string[] = []

  const validEnvironments: EnvironmentType[] = [
    'twilight_zone',
    'abyssal_plain',
    'hadal_trench',
    'hydrothermal_vents',
    'underwater_canyon',
    'open_deep_sea_habitat'
  ]

  const environment: EnvironmentType =
    inputs.environment && validEnvironments.includes(inputs.environment)
      ? inputs.environment
      : 'abyssal_plain'

  const envConfig = ENVIRONMENTS[environment]

  let depthMeters = typeof inputs.depthMeters === 'number' && Number.isFinite(inputs.depthMeters)
    ? inputs.depthMeters
    : envConfig.defaultDepth

  if (depthMeters < 200 || depthMeters > 11000) {
    errors.push(`Depth must be between 200 m (mesopelagic boundary) and 11,000 m (Challenger Deep). Received: ${depthMeters} m.`)
    depthMeters = Math.max(200, Math.min(11000, depthMeters))
  }

  let temperatureCelsius = typeof inputs.temperatureCelsius === 'number' && Number.isFinite(inputs.temperatureCelsius)
    ? inputs.temperatureCelsius
    : envConfig.defaultTemp

  if (environment === 'hydrothermal_vents') {
    if (temperatureCelsius < -2 || temperatureCelsius > 80) {
      errors.push(`Hydrothermal vent organism habitat temperature must be between -2°C and 80°C. Living organisms occupy the mixing boundary layer (typically 2°C–38°C), not the 350°C chimney interior. Received: ${temperatureCelsius}°C.`)
      temperatureCelsius = Math.max(-2, Math.min(80, temperatureCelsius))
    }
  } else {
    if (temperatureCelsius < -2.5 || temperatureCelsius > 30) {
      errors.push(`Deep-sea ambient water temperature must be between -2.5°C and 30°C. Received: ${temperatureCelsius}°C.`)
      temperatureCelsius = Math.max(-2.5, Math.min(30, temperatureCelsius))
    }
  }

  const validLights: LightAvailability[] = ['none', 'bioluminescence_only', 'weak_residual', 'geothermal_glow']
  const lightAvailability: LightAvailability =
    inputs.lightAvailability && validLights.includes(inputs.lightAvailability)
      ? inputs.lightAvailability
      : envConfig.defaultLight

  const validOxygens: OxygenAvailability[] = ['anoxic', 'oxygen_minimum_zone', 'standard_deep_water', 'well_oxygenated_cold_plume']
  const oxygenAvailability: OxygenAvailability =
    inputs.oxygenAvailability && validOxygens.includes(inputs.oxygenAvailability)
      ? inputs.oxygenAvailability
      : envConfig.defaultOxygen

  const validFoods: FoodSource[] = ['marine_snow', 'chemosynthetic_microbes', 'whale_falls_and_carrion', 'predatory_ambush', 'benthic_sediment_detritus']
  const foodSource: FoodSource =
    inputs.foodSource && validFoods.includes(inputs.foodSource)
      ? inputs.foodSource
      : envConfig.defaultFood

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      environment,
      depthMeters,
      temperatureCelsius,
      lightAvailability,
      oxygenAvailability,
      foodSource
    }
  }
}

export function predictCreature(
  rawInputs: Partial<EnvironmentalInputs>,
  variationSeed: number = Math.floor(Math.random() * 100000)
): PredictionResponse {
  const validation = validateEnvironmentalInputs(rawInputs)
  const inputs = validation.sanitized
  const envConfig = ENVIRONMENTS[inputs.environment]

  const pressure = calculatePressure(inputs.depthMeters)
  const archetype = selectArchetype(inputs.environment, variationSeed)
  const names = generateScientificName(archetype, inputs.environment, variationSeed)
  const cellularAdaptations = determineCellularAdaptations(
    inputs.depthMeters,
    inputs.temperatureCelsius,
    inputs.oxygenAvailability,
    inputs.environment
  )
  const bioluminescence = determineBioluminescence(
    inputs.lightAvailability,
    inputs.depthMeters,
    inputs.environment,
    variationSeed
  )
  const sensoryAdaptations = determineSensoryAdaptations(
    inputs.lightAvailability,
    inputs.depthMeters,
    inputs.environment
  )
  const inspirationSpecies = selectInspirationSpecies(
    inputs.environment,
    inputs.depthMeters
  )

  // Construct ecological role and diet description
  let possibleDiet = ''
  let ecologicalRole = ''
  switch (inputs.foodSource) {
    case 'chemosynthetic_microbes':
      possibleDiet = 'Chemoautotrophic sulfur-oxidizing and methane-oxidizing bacteria cultivated in internal bacteriocytes or grazed from mineral chimney substrate.'
      ecologicalRole = 'Primary consumer / Symbiotic engineer anchoring the hydrothermal vent food web.'
      break
    case 'whale_falls_and_carrion':
      possibleDiet = 'Large vertebrate carcasses, sunken cetacean bones, and episodic necrophagous organic falls.'
      ecologicalRole = 'Opportunistic scavenger / recycler accelerating abyssal carbon burial and nutrient return.'
      break
    case 'predatory_ambush':
      possibleDiet = 'Bathypelagic lanternfishes, myctophids, deep-water squids, and pelagic decapods.'
      ecologicalRole = 'Apex bathypelagic ambush predator occupying top trophic rank in the aphotic water column.'
      break
    case 'benthic_sediment_detritus':
      possibleDiet = 'Refractory organic carbon, meiofauna, and microbial biofilms binding hadal sediment grains.'
      ecologicalRole = 'Benthic deposit feeder / bioturbator processing deep trench sedimentary organic matter.'
      break
    case 'marine_snow':
    default:
      possibleDiet = 'Particulate Organic Carbon (POC), aggregating marine snow flocs, fecal pellets, and larvacean mucous filters sinking from the epipelagic.'
      ecologicalRole = 'Suspension filter feeder coupling surface biological pump production directly to deep-sea benthic fauna.'
      break
  }

  // Construct detailed biological rationale
  const biologicalRationale = [
    `At a depth of ${inputs.depthMeters} meters, the organism withstands an absolute hydrostatic pressure of ${pressure.absoluteAtm} atmospheres (${pressure.absoluteBar} bar). Under this immense mechanical load, ordinary cell membranes solidify and unadapted proteins denature; this organism employs high concentrations of piezolytes (e.g., TMAO) and polyunsaturated fatty-acid membrane fluidity.`,
    `Water temperature of ${inputs.temperatureCelsius.toFixed(1)}°C ${inputs.environment === 'hydrothermal_vents' ? 'reflects the chaotic thermal mixing zone where scalding geothermal effluent mixes with near-freezing bottom water, demanding specialized heat-shock chaperones' : 'maintains near-isothermal conditions, slowing metabolic enzymatic turnover and favoring slow, energy-efficient growth rates'}.`,
    inputs.lightAvailability === 'none'
      ? 'In absolute aphotic darkness, ocular optical organs are reduced in favor of expanded mechanoreceptive lateral line systems and extended tactile fin rays.'
      : inputs.lightAvailability === 'weak_residual'
      ? 'Under dim residual downwelling sunlight, upward-oriented tubular eyes with dual-pigment retinas maximize contrast against silhouette prey.'
      : inputs.lightAvailability === 'geothermal_glow'
      ? 'Near hydrothermal chimneys, naked dorsal photoreceptors detect subtle near-infrared geothermal blackbody radiation emitted by 350°C mineral vents.'
      : 'In a bioluminescence-dominated midwater, binocular blue-green sensitive retinas resolve brief photophore signaling flashes.',
    inputs.oxygenAvailability === 'oxygen_minimum_zone'
      ? 'Within the severe Oxygen Minimum Zone, specialized respiratory pigments with extreme binding affinity extract vital oxygen despite partial pressures that would asphyxiate epipelagic species.'
      : 'Oxygen availability supports stable, albeit metabolically depressed, cellular respiration in cold ambient currents.'
  ].join(' ')

  const uncertainties = [
    'Hypothetical prediction based on comparative morphology and known biophysical principles; actual biological evolution is contingent on unrecorded historical phylogenies.',
    'Environmental parameters (depth, temperature, pressure) impose strong evolutionary selection pressures, but do not deterministically guarantee any single morphology.',
    'Intracellular piezolyte limits (such as the Yancey Osmolyte Threshold) suggest teleost fish life ceases below ~8,200–8,400 meters, so deeper predictions represent speculative invertebrate or non-standard adaptations.',
    inputs.environment === 'hydrothermal_vents'
      ? 'Hydrothermal chimneys have finite lifespans (decades to centuries); organisms in this habitat must have undiscovered high-dispersal larval phases to colonize newly venting rifts.'
      : 'Food availability in the abyssal plain relies heavily on seasonal pulses of epipelagic blooms (the biological pump), which may induce prolonged dormant metabolic states.'
  ]

  const imagePrompt = `Scientific speculative concept illustration of ${names.scientific} (${names.common}), an undiscovered deep-sea organism adapted to ${envConfig.displayName} at ${inputs.depthMeters}m depth. ${archetype.baseAppearance} Features: ${archetype.bodyPlan}. ${bioluminescence.present ? `Bioluminescent accents: ${bioluminescence.wavelengthAndColor} glowing photophores.` : 'Velvety light-absorbing dermis.'} Deep ocean background with faint marine snow and volumetric marine lighting, scientific specimen plate aesthetic.`

  const creature: PredictedCreature = {
    id: `unknown-${Date.now()}-${Math.abs(variationSeed % 10000)}`,
    name: names.common,
    scientificName: names.scientific,
    hypothetical: true,
    environment: envConfig.displayName,
    environmentType: inputs.environment,
    depthMeters: inputs.depthMeters,
    depthRange: `${inputs.depthMeters} m (Hydrostatic load: ~${Math.round(pressure.gaugeBar)} bar)`,
    temperatureCelsius: inputs.temperatureCelsius,
    temperatureRange: `${inputs.temperatureCelsius.toFixed(1)} °C`,
    pressureMetrics: pressure,
    appearance: archetype.baseAppearance,
    bodyPlan: archetype.bodyPlan,
    estimatedSize: archetype.typicalSizeRange,
    sensoryAdaptations,
    bioluminescence,
    cellularAndBiochemicalAdaptations: cellularAdaptations,
    possibleDiet,
    ecologicalRole,
    biologicalRationale,
    inspirationSpecies,
    uncertainties,
    imagePrompt,
    imageUrl: null,
    imageStatus: 'fallback',
    imageConceptBadge: 'Scientific Speculative Concept (Vector Illustration)',
    generatedAt: new Date().toISOString()
  }

  return {
    success: true,
    creature,
    validationIssues: validation.errors.length > 0 ? validation.errors : undefined
  }
}
