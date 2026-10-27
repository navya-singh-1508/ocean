import type {
  EnvironmentType,
  LightAvailability,
  OxygenAvailability,
  FoodSource,
  BioluminescenceProfile,
  InspirationSpecies
} from '../types.js'
import { INSPIRATION_SPECIES } from './inspirationDatabase.js'

export interface BodyArchetype {
  name: string
  scientificPrefix: string
  typicalSizeRange: string
  bodyPlan: string
  compatibleEnvironments: EnvironmentType[]
  baseAppearance: string
}

export const ARCHETYPES: BodyArchetype[] = [
  {
    name: 'Snailfish-like Hadal Benthopelagic',
    scientificPrefix: 'Piezoliparis',
    typicalSizeRange: '18 – 32 cm length; 110 – 240 g mass',
    bodyPlan: 'Gelatinous, scaleless tadpole-like teleost with non-calcified cartilaginous cranial plates and ventral suction disc',
    compatibleEnvironments: ['hadal_trench', 'abyssal_plain'],
    baseAppearance: 'Translucent pinkish-white dermis exposing internal organs and dark liver; large bulbous head tapering to an elongated, ribbon-like caudal fin.'
  },
  {
    name: 'Giant Abyssal Gigantostracan Isopod',
    scientificPrefix: 'Bathystraca',
    typicalSizeRange: '35 – 58 cm length; 1.2 – 2.8 kg mass',
    bodyPlan: 'Dorso-ventrally flattened chitinous exoskeleton with 14 articulated walking pereopods and swimming pleopods',
    compatibleEnvironments: ['abyssal_plain', 'underwater_canyon', 'hadal_trench'],
    baseAppearance: 'Slate-gray to pale porcelain segmented carapace with flexible articular membranes and serrated lateral epimera.'
  },
  {
    name: 'Chemosynthetic Siphon-Tubeworm',
    scientificPrefix: 'Pyrosiphon',
    typicalSizeRange: '1.2 – 2.4 m tube length; 3 – 5 cm diameter',
    bodyPlan: 'Sessile sclerotized chitin-protein cylinder terminating in a vascularized, bright-crimson branchial plume; digestive tract entirely absent',
    compatibleEnvironments: ['hydrothermal_vents'],
    baseAppearance: 'Stiff, bone-white protective tubes cluster in dense bush-like colonies, topped by radiant scarlet plume filaments bathed in mineral shimmer.'
  },
  {
    name: 'Abyssal Tripod Stilt-Dweller',
    scientificPrefix: 'Bathystilus',
    typicalSizeRange: '28 – 44 cm body length; 1.1 m stilt fin ray extensions',
    bodyPlan: 'Elongated, slender osteichthyan body with hypertrophied, rigid pelvic and lower caudal fin rays acting as a tripod suspension scaffold',
    compatibleEnvironments: ['abyssal_plain', 'underwater_canyon'],
    baseAppearance: 'Subtle metallic iridescent scales along the lateral margins; perched motionless 1 meter above the abyssal ooze facing benthic currents.'
  },
  {
    name: 'Mesopelagic Barreleye Stalker',
    scientificPrefix: 'Tubophthalmus',
    typicalSizeRange: '14 – 22 cm length; 80 – 160 g mass',
    bodyPlan: 'Compact, deep-bodied fish with a fluid-filled transparent cranial dome housing upwardly directed tubular eyes',
    compatibleEnvironments: ['twilight_zone', 'open_deep_sea_habitat'],
    baseAppearance: 'Velvety dark-brown body with emerald-green luminescent lenses glowing within a clear crystalline head canopy.'
  },
  {
    name: 'Bathypelagic Sinuous Viper-Eel',
    scientificPrefix: 'Chauliosoma',
    typicalSizeRange: '45 – 85 cm length; 250 – 500 g mass',
    bodyPlan: 'Serpentine, highly distensible teleost with disproportionately large hinged jaws, long curved fang teeth, and expandable elastic stomach',
    compatibleEnvironments: ['open_deep_sea_habitat', 'twilight_zone', 'underwater_canyon'],
    baseAppearance: 'Jet-black skin absorbing over 99.5% of incident light (ultra-black biomaterial), accented by discrete sapphire photophore spots along the ventral flank.'
  },
  {
    name: 'Benthic Vent Sclerobalanid Shrimp',
    scientificPrefix: 'Vulcanocaris',
    typicalSizeRange: '6 – 12 cm length; 25 – 60 g mass',
    bodyPlan: 'Robust decapod crustacean with fused dorsal naked photoreceptor organ, specialized ciliated maxillipeds, and heat-resistant cuticle',
    compatibleEnvironments: ['hydrothermal_vents'],
    baseAppearance: 'Chalk-white carapace often covered in orange and black iron-sulfide mineral crusts, swarming in dense undulating layers over chimney walls.'
  },
  {
    name: 'Gelatinous Vampyromorphic Detritivore',
    scientificPrefix: 'Cryptoteuthis',
    typicalSizeRange: '25 – 40 cm mantle length; 300 – 700 g mass',
    bodyPlan: 'Soft-bodied cephalopod with eight webbed arms, two retractile sensory velar filaments, and bioluminescent organs on arm tips and mantle base',
    compatibleEnvironments: ['open_deep_sea_habitat', 'twilight_zone'],
    baseAppearance: 'Deep maroon to velvet purple gelatinous mantle that pulsates softly with slow, metabolic-conserving bell contractions.'
  }
]

export function selectArchetype(environment: EnvironmentType, seed: number): BodyArchetype {
  const matching = ARCHETYPES.filter((a) => a.compatibleEnvironments.includes(environment))
  if (matching.length === 0) return ARCHETYPES[0]
  const index = Math.abs(seed) % matching.length
  return matching[index]
}

export function determineCellularAdaptations(
  depthMeters: number,
  temperature: number,
  oxygen: OxygenAvailability,
  environment: EnvironmentType
): string[] {
  const list: string[] = []

  // Hydrostatic pressure rules
  if (depthMeters >= 6000) {
    list.push('High cellular Trimethylamine N-oxide (TMAO) and scyllo-inositol concentrations preventing pressure-induced protein denaturation (Yancey piezolyte hypothesis).')
    list.push('Hyper-fluid phospholipid cell membranes enriched in polyunsaturated docosahexaenoic fatty acids (homeoviscous adaptation under 600+ atm).')
    list.push('Piezophilic oligomeric enzymes with reduced subunit contact surface areas to prevent hydrostatic dissociation.')
  } else if (depthMeters >= 2000) {
    list.push('Moderate TMAO and betaine cellular osmolyte stabilization for cellular enzymes operating at >200 bar.')
    list.push('Elevated unsaturated-to-saturated lipid ratio in cellular membranes to maintain ion pump mobility in cold pressurized water.')
  } else {
    list.push('Standard mesopelagic pressure tolerance with metabolic enzyme flexibility for vertical migrators.')
  }

  // Thermal rules
  if (environment === 'hydrothermal_vents' && temperature > 15) {
    list.push('High-density Heat Shock Protein chaperone systems (Hsp70/Hsp90) that rapidly refold thermally stressed cytosolic enzymes.')
    list.push('Extracellular hemoglobin complexes capable of reversible oxygen binding up to 35°C in the presence of dissolved hydrogen sulfide.')
  } else if (temperature <= 2) {
    list.push('High concentration of intracellular glycerol and antifreeze peptides lowering the freezing point of cytosolic fluid below ambient seawater.')
  }

  // Oxygen rules
  if (oxygen === 'oxygen_minimum_zone' || oxygen === 'anoxic') {
    list.push('Ultra-high-affinity respiratory pigments (P50 < 1.2 mmHg) capable of extracting trace dissolved oxygen where conventional gills suffocate.')
    list.push('Suppressed aerobic metabolic rate coupled with expanded capacity for anaerobic malate-aspartate fermentation pathways.')
  } else if (oxygen === 'well_oxygenated_cold_plume') {
    list.push('Thermally stabilized, oxygen-efficient aerobic respiration optimized for high gas solubility in near-freezing bottom currents.')
  }

  return list
}

export function determineBioluminescence(
  light: LightAvailability,
  depthMeters: number,
  environment: EnvironmentType,
  seed: number
): BioluminescenceProfile {
  if (light === 'none' && depthMeters > 7000) {
    // Ultra-deep hadal trench creatures frequently lose bioluminescence due to metabolic cost
    const hasVestigial = seed % 3 === 0
    if (!hasVestigial) {
      return {
        present: false,
        mechanism: 'None / Complete absence',
        function: 'Non-bioluminescent; metabolic energy is completely diverted to osmotic regulation and protein maintenance under hadal pressure.',
        wavelengthAndColor: 'N/A'
      }
    }
  }

  if (environment === 'hydrothermal_vents') {
    return {
      present: false,
      mechanism: 'Endogenous bioluminescence absent; species relies on ambient thermal blackbody infrared detection',
      function: 'Vent organisms rely on chemosensory and thermal sensing rather than light production in cloudy sulfide plumes.',
      wavelengthAndColor: 'N/A (Detects geothermal emission ~900–1050 nm)'
    }
  }

  if (light === 'weak_residual' || depthMeters < 1000) {
    return {
      present: true,
      mechanism: 'Coelenterazine-luciferase reaction inside photophore arrays',
      function: 'Ventral counterillumination: emitting downwelling-matched light to cancel the animal’s silhouette against predatory eyes below.',
      wavelengthAndColor: '470 nm (Aquamarine / Cyan blue)'
    }
  }

  const variations = [
    {
      present: true,
      mechanism: 'Symbiotic Photobacterium colonies housed inside an anterior esca bulb',
      function: 'Prey lure and territorial intraspecific signaling in complete aphotic gloom.',
      wavelengthAndColor: '480 nm (Oceanic cyan glow)'
    },
    {
      present: true,
      mechanism: 'Autogenous luciferin-luciferase storage granules in epidermal photocytes',
      function: 'Sudden defensive bioluminescent flash to stun predators and reveal them to secondary apex hunters (burglar alarm hypothesis).',
      wavelengthAndColor: '465 nm (Piercing cobalt flash)'
    },
    {
      present: true,
      mechanism: 'Secreted luminescent slime clouds discharged from dermal pores',
      function: 'Escape decoy: releases an expanding glowing cloud while the organism propels away into the dark.',
      wavelengthAndColor: '475 nm (Diffusing sapphire shimmer)'
    }
  ]

  return variations[Math.abs(seed) % variations.length]
}

export function determineSensoryAdaptations(
  light: LightAvailability,
  depthMeters: number,
  environment: EnvironmentType
): string {
  if (environment === 'hydrothermal_vents') {
    return 'Hyper-developed chemosensory antennules tuned to hydrogen sulfide and mineral ion gradients; fused dorsal naked photoreceptor organ optimized for near-infrared thermal radiation emitted by mineral chimneys.'
  }
  if (light === 'weak_residual') {
    return 'Large tubular eyes pointed vertically with specialized green filter pigments and secondary accessory retinas for dual-plane field detection.'
  }
  if (depthMeters >= 7000) {
    return 'Microphthalmic or subcutaneous degenerated eye structures; primary navigation and prey detection governed by hypertrophied mechanosensory lateral lines and tactile head pores.'
  }
  return 'Hyper-sensitive rod-only binocular retinas with tapetum lucidum reflection layer; extended tactile sensory rays detecting micro-turbulences in the water column.'
}

export function selectInspirationSpecies(
  environment: EnvironmentType,
  depthMeters: number
): InspirationSpecies[] {
  const selected: InspirationSpecies[] = []

  if (environment === 'hydrothermal_vents') {
    selected.push(INSPIRATION_SPECIES.giant_tubeworm)
    selected.push(INSPIRATION_SPECIES.vent_shrimp)
    selected.push(INSPIRATION_SPECIES.pompeii_worm)
    return selected
  }

  if (depthMeters >= 6000) {
    selected.push(INSPIRATION_SPECIES.mariana_snailfish)
    selected.push(INSPIRATION_SPECIES.hadal_amphipod)
    selected.push(INSPIRATION_SPECIES.giant_isopod)
    return selected
  }

  if (environment === 'abyssal_plain') {
    selected.push(INSPIRATION_SPECIES.tripodfish)
    selected.push(INSPIRATION_SPECIES.giant_isopod)
    selected.push(INSPIRATION_SPECIES.blobfish)
    return selected
  }

  if (environment === 'twilight_zone') {
    selected.push(INSPIRATION_SPECIES.barreleye)
    selected.push(INSPIRATION_SPECIES.viperfish)
    selected.push(INSPIRATION_SPECIES.vampire_squid)
    return selected
  }

  // Canyon or open deep sea
  selected.push(INSPIRATION_SPECIES.viperfish)
  selected.push(INSPIRATION_SPECIES.vampire_squid)
  selected.push(INSPIRATION_SPECIES.blobfish)
  return selected
}

export function generateScientificName(
  archetype: BodyArchetype,
  environment: EnvironmentType,
  seed: number
): { common: string; scientific: string } {
  const prefixes = [archetype.scientificPrefix, 'Bathy', 'Hadalo', 'Cryptonectes', 'Piezostoma', 'Abyssomicros']
  const suffixes = ['abyssorum', 'hadaliensis', 'profundus', 'pelagica', 'sulfuriphila', 'chimeroides', 'marisobscuri', 'tenebrosa']

  const p = prefixes[Math.abs(seed) % prefixes.length]
  const s = suffixes[Math.abs(seed * 7 + 3) % suffixes.length]

  const commonNamesByEnv: Record<EnvironmentType, string[]> = {
    twilight_zone: ['Ghost-Eye Lantern Prowler', 'Silverside Silhouette Stalker', 'Twilight Crown-Drifter', 'Dusk Chimera-Ray'],
    abyssal_plain: ['Tripod Silt-Strider', 'Porcelain Abyssal Armor-Bug', 'Sediment Velvet-Fish', 'Gilded Ooze-Glider'],
    hadal_trench: ['Mariana Ghost Snailfish', 'Ultra-Hadal Suture-Amphipod', 'Chasm Phantom-Slug', 'Trench Crystal-Worm'],
    hydrothermal_vents: ['Smoker-Crested Chimney Crawler', 'Sulfur Plume Siphon-Worm', 'Thermal Rift Prowler', 'Pyritic Sclerotized Shrimp'],
    underwater_canyon: ['Canyon Eddy Suspension-Drifter', 'Gorge Spire-Eel', 'Current-Crested Stone-Isopod', 'Submarine Rift Viper'],
    open_deep_sea_habitat: ['Abyssal Velvet Swallower', 'Midnight Umbraculum Medusa', 'Pelagic Phantom Squid', 'Gelatinous Deep-Drifter']
  }

  const commonPool = commonNamesByEnv[environment]
  const common = commonPool[Math.abs(seed) % commonPool.length]

  return {
    common,
    scientific: `${p} ${s}`
  }
}
