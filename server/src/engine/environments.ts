import type { EnvironmentType, LightAvailability, OxygenAvailability, FoodSource, PressureMetrics } from '../types.js'

export interface EnvironmentDescriptor {
  id: EnvironmentType
  displayName: string
  zoneClass: string
  defaultDepth: number
  minDepth: number
  maxDepth: number
  defaultTemp: number
  minTemp: number
  maxTemp: number
  defaultLight: LightAvailability
  defaultOxygen: OxygenAvailability
  defaultFood: FoodSource
  scientificOverview: string
  thermalNote: string
}

export const ENVIRONMENTS: Record<EnvironmentType, EnvironmentDescriptor> = {
  twilight_zone: {
    id: 'twilight_zone',
    displayName: 'Twilight Zone (Mesopelagic)',
    zoneClass: 'Dysphotic (200 m – 1,000 m)',
    defaultDepth: 650,
    minDepth: 200,
    maxDepth: 1000,
    defaultTemp: 8.0,
    minTemp: 4.0,
    maxTemp: 18.0,
    defaultLight: 'weak_residual',
    defaultOxygen: 'oxygen_minimum_zone',
    defaultFood: 'marine_snow',
    scientificOverview: 'The boundary layer where sunlight dims into complete darkness. Often coincides with the Oxygen Minimum Zone (OMZ) where microbial respiration depletes oxygen.',
    thermalNote: 'Thermocline region with sharp drop from surface warmth down to cold sub-surface water.'
  },
  abyssal_plain: {
    id: 'abyssal_plain',
    displayName: 'Abyssal Plain (Abyssopelagic Benthic)',
    zoneClass: 'Aphotic Benthic (3,000 m – 6,000 m)',
    defaultDepth: 4500,
    minDepth: 3000,
    maxDepth: 6000,
    defaultTemp: 2.2,
    minTemp: -0.5,
    maxTemp: 4.0,
    defaultLight: 'none',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'marine_snow',
    scientificOverview: 'Vast, sediment-covered ocean floor characterized by near-freezing temperatures, high hydrostatic pressure (300–600 atm), and sparse food input.',
    thermalNote: 'Homogeneously cold water mass fed by deep thermohaline circulation (e.g., North Atlantic Deep Water).'
  },
  hadal_trench: {
    id: 'hadal_trench',
    displayName: 'Hadal Trench (Subduction Zones)',
    zoneClass: 'Ultra-Deep Aphotic (6,000 m – 11,000 m)',
    defaultDepth: 8400,
    minDepth: 6000,
    maxDepth: 11000,
    defaultTemp: 1.5,
    minTemp: 0.8,
    maxTemp: 3.5,
    defaultLight: 'none',
    defaultOxygen: 'well_oxygenated_cold_plume',
    defaultFood: 'benthic_sediment_detritus',
    scientificOverview: 'Deep V-shaped trenches formed by subducting tectonic plates. Hydrostatic pressure exceeds 600–1,100 atm, requiring extreme cellular adaptations including massive concentrations of piezolytes (TMAO).',
    thermalNote: 'Stable cold abyssal-hadal interface; slightly warmed at the very bottom due to adiabatic compression and geothermal mantle heat flow.'
  },
  hydrothermal_vents: {
    id: 'hydrothermal_vents',
    displayName: 'Hydrothermal Vent Mixing Zone',
    zoneClass: 'Chemosynthetic Chimney Microhabitat (1,500 m – 4,000 m)',
    defaultDepth: 2500,
    minDepth: 1000,
    maxDepth: 5000,
    defaultTemp: 14.0,
    minTemp: 2.0,
    maxTemp: 38.0,
    defaultLight: 'geothermal_glow',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'chemosynthetic_microbes',
    scientificOverview: 'Dynamic mixing zone around mineral chimneys (black and white smokers). While pure effluent fluids reach 350°C–400°C, living fauna inhabit the turbulent surrounding boundary layer (2°C–38°C) rich in hydrogen sulfide and dissolved metals.',
    thermalNote: 'Organisms do NOT survive inside the superheated fluid; they thrive in steep thermal and chemical gradients formed by rapid mixing with ambient 2°C seawater.'
  },
  underwater_canyon: {
    id: 'underwater_canyon',
    displayName: 'Submarine Canyon System',
    zoneClass: 'Bathypelagic / High-Current Slope (500 m – 3,500 m)',
    defaultDepth: 1600,
    minDepth: 500,
    maxDepth: 3500,
    defaultTemp: 4.5,
    minTemp: 1.5,
    maxTemp: 10.0,
    defaultLight: 'none',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'marine_snow',
    scientificOverview: 'Steep geological conduits cut into continental margins. Strong internal tidal currents concentrate suspended organic particles and marine snow, supporting dense suspension feeder communities.',
    thermalNote: 'Current-driven upwelling and internal waves create localized temperature and nutrient fluctuations.'
  },
  open_deep_sea_habitat: {
    id: 'open_deep_sea_habitat',
    displayName: 'Open Deep Pelagic Water Column',
    zoneClass: 'Bathypelagic Water Column (1,000 m – 4,000 m)',
    defaultDepth: 2200,
    minDepth: 1000,
    maxDepth: 4000,
    defaultTemp: 3.0,
    minTemp: 1.0,
    maxTemp: 6.0,
    defaultLight: 'bioluminescence_only',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'predatory_ambush',
    scientificOverview: 'The largest habitat on Earth by volume. Completely sunless mid-water with no physical solid surfaces; inhabited by neutrally buoyant swimmers, gelatinous drifters, and ambush predators.',
    thermalNote: 'Uniformly cold isothermal zone with minimal seasonal variation.'
  }
}

/**
 * Calculates physical hydrostatic pressure metrics from depth in meters.
 * Using seawater density rho ~ 1026 kg/m^3 and g ~ 9.80665 m/s^2.
 */
export function calculatePressure(depthMeters: number): PressureMetrics {
  const clampedDepth = Math.max(0, depthMeters)
  const rho = 1026 // kg/m^3 average deep sea density
  const g = 9.80665 // m/s^2
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
    explanation: `Gauge pressure (${Math.round(gaugeBar)} bar / ${Math.round(gaugeAtm)} atm) is the hydrostatic load of the water column above. Absolute pressure (${Math.round(absoluteBar)} bar / ${Math.round(absoluteAtm)} atm) includes the 1.013 bar atmospheric pressure pressing on the sea surface.`
  }
}
