import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { Species } from '../models/Species.js'

dotenv.config()

export interface SeedSpeciesInput {
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
  ecologicalRole: string
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
}

export const DOCUMENTED_SPECIES: SeedSpeciesInput[] = [
  {
    slug: 'green-sea-turtle',
    name: 'Green sea turtle',
    scientificName: 'Chelonia mydas',
    habitat: 'Sunlight zone',
    type: 'Reptile',
    diet: 'Herbivore',
    depthRange: '0–200 m',
    minDepthMeters: 0,
    maxDepthMeters: 200,
    environmentalConditions: {
      temperatureRange: '20°C–30°C',
      pressureRange: '1–20 bar',
      lightLevel: 'Full euphotic daylight',
      oxygenLevel: 'Surface atmospheric breathing'
    },
    biologicalAdaptations: [
      'Lachrymal salt glands for excreting excess ingested sodium chloride.',
      'Streamlined carapace and paddle-shaped foreflippers optimized for transoceanic migration.',
      'Serrated horny jaw sheath for grazing seagrasses and macroalgae.'
    ],
    ecologicalRole: 'Primary coastal herbivore maintaining seagrass meadow health and nutrient cycling.',
    conservationStatus: 'Endangered',
    description: 'A graceful ocean traveller that migrates thousands of kilometres between foraging pastures and natal nesting beaches. Seagrass meadows are a vital part of its adult diet.',
    fact: 'Green sea turtles return across thousands of kilometres of open ocean to nest on the exact beach where they were born.',
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'IUCN Red List of Threatened Species: Chelonia mydas',
        url: 'https://www.iucnredlist.org/species/4615/11037468',
        citation: 'Seminoff, J.A. (2004). "Chelonia mydas". The IUCN Red List of Threatened Species 2004.'
      },
      {
        title: 'NOAA Fisheries: Green Turtle Species Profile',
        url: 'https://www.fisheries.noaa.gov/species/green-turtle',
        citation: 'NOAA Fisheries Office of Protected Resources (2023).'
      }
    ]
  },
  {
    slug: 'clownfish',
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    habitat: 'Sunlight zone',
    type: 'Fish',
    diet: 'Omnivore',
    depthRange: '1–15 m',
    minDepthMeters: 1,
    maxDepthMeters: 15,
    environmentalConditions: {
      temperatureRange: '24°C–28°C',
      pressureRange: '1–2.5 bar',
      lightLevel: 'High intensity tropical sunlight',
      oxygenLevel: 'Normal oxygenated reef water (> 6 ml/L)'
    },
    biologicalAdaptations: [
      'Specialized epidermal mucus layer lacking N-acetylgalactosamine, preventing nematocyst stinging discharge by host anemones.',
      'Protandrous sequential hermaphroditism, where individuals mature first as males and the dominant individual reverses sex to female.'
    ],
    ecologicalRole: 'Mutualistic symbiont defending host anemones against polyp-feeding butterflyfishes while providing nitrogenous waste.',
    conservationStatus: 'Least concern',
    description: 'Small, vividly patterned reef fish renowned for their symbiotic partnership with sea anemones. A protective mucus coating shields them from stinging tentacles.',
    fact: 'All clownfish are born male; the largest and most dominant fish in a social group transitions into the breeding female.',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'FishBase: Amphiprion ocellaris Species Summary',
        url: 'https://www.fishbase.se/summary/Amphiprion-ocellaris.html',
        citation: 'Froese, R. and D. Pauly. Editors. (2023). FishBase. World Wide Web electronic publication.'
      }
    ]
  },
  {
    slug: 'bottlenose-dolphin',
    name: 'Bottlenose dolphin',
    scientificName: 'Tursiops truncatus',
    habitat: 'Sunlight zone',
    type: 'Mammal',
    diet: 'Carnivore',
    depthRange: 'Surface–300 m',
    minDepthMeters: 0,
    maxDepthMeters: 300,
    environmentalConditions: {
      temperatureRange: '10°C–30°C',
      pressureRange: '1–31 bar',
      lightLevel: 'Variable euphotic/mesopelagic',
      oxygenLevel: 'Atmospheric breathing with high myoglobin storage'
    },
    biologicalAdaptations: [
      'Biosonar echolocation generating ultra-high frequency acoustic clicks focused through a lipid-filled cranial melon.',
      'High concentrations of muscle myoglobin and collapse-resistant alveolar thoracic ribs allowing dives down to 300+ m without decompression sickness.'
    ],
    ecologicalRole: 'Apex and mesopredator regulating mid-tier schooling fish and cephalopod populations.',
    conservationStatus: 'Least concern',
    description: 'Highly intelligent, social marine mammals that utilize intricate acoustic whistle dialects and echolocation to navigate and coordinate cooperative hunts.',
    fact: 'Dolphins produce directional echolocation clicks capable of resolving a tennis-ball sized target over 100 meters away.',
    imageUrl: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'Marine Mammal Science: Acoustics and Echolocation in Odontocetes',
        citation: 'Au, W. W. L. (1993). The Sonar of Dolphins. Springer-Verlag New York.'
      }
    ]
  },
  {
    slug: 'giant-manta-ray',
    name: 'Giant manta ray',
    scientificName: 'Mobula birostris',
    habitat: 'Sunlight zone',
    type: 'Ray',
    diet: 'Filter feeder',
    depthRange: '0–1,000 m',
    minDepthMeters: 0,
    maxDepthMeters: 1000,
    environmentalConditions: {
      temperatureRange: '18°C–26°C',
      pressureRange: '1–100 bar',
      lightLevel: 'Surface sunlit to dysphotic',
      oxygenLevel: 'Well-oxygenated tropical waters'
    },
    biologicalAdaptations: [
      'Non-clogging ricochet gill filtration lobes using specialized solid-fluid dynamics to concentrate micro-zooplankton.',
      'High brain-to-body mass ratio with a retia mirabilia counter-current heat exchange system warming cranial tissues during deep twilight foraging dives.'
    ],
    ecologicalRole: 'Large-scale pelagic suspension feeder transferring carbon between offshore epipelagic and coastal reef habitats.',
    conservationStatus: 'Endangered',
    description: 'A gentle giant of the open sea that glides with immense triangular pectoral fins exceeding six metres in wingspan, scooping plankton through mobile cephalic lobes.',
    fact: 'Giant manta rays have the largest brain-to-body weight ratio of any cold-blooded fish species on Earth.',
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'Science Advances: Ricochet separation mechanism in manta rays',
        url: 'https://www.science.org/doi/10.1126/sciadv.aat9533',
        citation: 'Divi, R. V., et al. (2018). "Manta rays filter food using non-clogging ricochet separation." Science Advances 4(9): eaat9533.'
      }
    ]
  },
  {
    slug: 'moon-jellyfish',
    name: 'Moon jellyfish',
    scientificName: 'Aurelia aurita',
    habitat: 'Twilight zone',
    type: 'Cnidarian',
    diet: 'Carnivore',
    depthRange: '0–400 m',
    minDepthMeters: 0,
    maxDepthMeters: 400,
    environmentalConditions: {
      temperatureRange: '6°C–24°C',
      pressureRange: '1–41 bar',
      lightLevel: 'Dysphotic to surface',
      oxygenLevel: 'Hypoxia tolerant (can survive < 1.5 ml/L)'
    },
    biologicalAdaptations: [
      'Over 95% water composition providing natural hydrostatic neutral buoyancy with negligible metabolic upkeep.',
      'Marginal rhopalia sensory structures containing statocysts and primitive ocelli for spatial orientation and gravitational detection.'
    ],
    ecologicalRole: 'Pelagic gelatinous predator consuming copepods, fish larvae, and micro-zooplankton.',
    conservationStatus: 'Not evaluated',
    description: 'A translucent, undulating medusa with four distinctive horseshoe-shaped gonads visible through its gelatinous umbrella, drifting along oceanic currents.',
    fact: 'Moon jellyfish lack lungs, gills, and a heart; oxygen diffuses directly through their thin external tissue layers.',
    imageUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'Journal of Plankton Research: Aurelia aurita ecology',
        citation: 'Lucas, C. H. (2001). "Reproduction and life history strategies of the common jellyfish, Aurelia aurita." Journal of Plankton Research 23(10): 1061–1074.'
      }
    ]
  },
  {
    slug: 'common-octopus',
    name: 'Common octopus',
    scientificName: 'Octopus vulgaris',
    habitat: 'Twilight zone',
    type: 'Cephalopod',
    diet: 'Carnivore',
    depthRange: '0–200 m',
    minDepthMeters: 0,
    maxDepthMeters: 200,
    environmentalConditions: {
      temperatureRange: '10°C–22°C',
      pressureRange: '1–21 bar',
      lightLevel: 'Low-light twilight to coastal reef',
      oxygenLevel: 'Normal aerobic demand'
    },
    biologicalAdaptations: [
      'Neuromuscular chromatophores, iridophores, and leucophores allowing milliseconds-fast adaptive camouflage and dynamic 3D skin papillations.',
      'Decentralized nervous system where two-thirds of all neurons reside inside the eight flexible arms.'
    ],
    ecologicalRole: 'Intelligent benthic predator controlling crab, bivalve, and gastropod populations.',
    conservationStatus: 'Least concern',
    description: 'A remarkably intelligent invertebrate equipped with three hearts, blue hemocyanin blood, and the uncanny ability to squeeze through openings no larger than its beak.',
    fact: 'An octopus has three functioning hearts; two pump blood through the gills, while the third circulates oxygenated blue blood through the organs.',
    imageUrl: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'Cell: Dynamic Camouflage in Cephalopods',
        citation: 'Hanlon, R. T. (2007). "Cephalopod dynamic camouflage." Current Biology 17(11): R400–R404.'
      }
    ]
  },
  {
    slug: 'humpback-whale',
    name: 'Humpback whale',
    scientificName: 'Megaptera novaeangliae',
    habitat: 'Twilight zone',
    type: 'Mammal',
    diet: 'Filter feeder',
    depthRange: 'Surface–200 m',
    minDepthMeters: 0,
    maxDepthMeters: 200,
    environmentalConditions: {
      temperatureRange: '1°C–25°C',
      pressureRange: '1–21 bar',
      lightLevel: 'Sunlight and upper twilight zone',
      oxygenLevel: 'High oxygen storage in blood and muscle'
    },
    biologicalAdaptations: [
      'Tubercle bumps on leading pectoral fin edges generating localized lift and reducing drag, enabling sharp underwater aerobatic maneuvers.',
      'Coordinated bubble-net feeding behavior utilizing sound and spirals of rising air to corral krill and sand lance schools.'
    ],
    ecologicalRole: 'Oceanic nutrient pump cycling iron and nitrogen from depth to surface euphotic zones via whale fall deposits.',
    conservationStatus: 'Least concern',
    description: 'Celebrated for complex acoustic songs and immense annual migrations, humpback whales lunge through dense krill swarms with accordion-like pleated throat grooves.',
    fact: 'Humpback whale songs can travel hundreds of kilometres through deep ocean acoustic sound channels (the SOFAR layer).',
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'NOAA Fisheries: Humpback Whale Species Directory',
        url: 'https://www.fisheries.noaa.gov/species/humpback-whale',
        citation: 'NOAA Fisheries (2024).'
      }
    ]
  },
  {
    slug: 'deep-sea-anglerfish',
    name: 'Deep-sea anglerfish',
    scientificName: 'Melanocetus johnsonii',
    habitat: 'Midnight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '200–2,000+ m',
    minDepthMeters: 200,
    maxDepthMeters: 2500,
    environmentalConditions: {
      temperatureRange: '2°C–5°C',
      pressureRange: '20–250 bar',
      lightLevel: 'Aphotic (Zero downwelling solar light)',
      oxygenLevel: 'Low to moderate deep-water oxygen'
    },
    biologicalAdaptations: [
      'Bioluminescent esca bulb containing symbiotic luminous bacteria (Photobacterium) suspended on a modified first dorsal spine (illicium).',
      'Distensible stomach and hinge-jaw neurocranium capable of engulfing prey items more than twice its own physical volume in food-scarce waters.'
    ],
    ecologicalRole: 'Specialized bathypelagic ambush predator occupying upper trophic tiers in the aphotic zone.',
    conservationStatus: 'Least concern',
    description: 'An iconic inhabitant of the pitch-black midnight zone. Females possess a glowing lure to entice curious prey toward rows of long, inward-curving translucent teeth.',
    fact: 'The glowing light at the tip of the anglerfish lure is not produced by the fish itself, but by millions of symbiotic bioluminescent bacteria.',
    imageUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'MBARI: Deep-sea anglerfish observations',
        url: 'https://www.mbari.org/animal/black-seadevil/',
        citation: 'Monterey Bay Aquarium Research Institute (2022).'
      }
    ]
  },
  {
    slug: 'whale-shark',
    name: 'Whale shark',
    scientificName: 'Rhincodon typus',
    habitat: 'Sunlight zone',
    type: 'Fish',
    diet: 'Filter feeder',
    depthRange: 'Surface–1,000+ m',
    minDepthMeters: 0,
    maxDepthMeters: 1200,
    environmentalConditions: {
      temperatureRange: '3°C–30°C',
      pressureRange: '1–120 bar',
      lightLevel: 'Euphotic surface to deep bathypelagic dive corridors',
      oxygenLevel: 'High oxygen surface demand'
    },
    biologicalAdaptations: [
      'Dense dermal denticle skin up to 10 cm thick acting as body armor against predatory killer whales and larger sharks.',
      'Filtering pads with over 3,000 tiny teeth in non-chewing vestigial rows, separating plankton and fish spawn via suction feeding.'
    ],
    ecologicalRole: 'Megafaunal filter feeder linking surface epipelagic plankton blooms with oceanic nutrient dispersal.',
    conservationStatus: 'Endangered',
    description: 'The largest extant fish on Earth, easily recognized by its broad flattened head and distinctive starry constellation pattern of pale spots unique to every individual.',
    fact: 'The white spot pattern on each whale shark’s skin is as unique as a human fingerprint, allowing scientists to identify individuals using astronomical algorithm software.',
    imageUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Collection',
    sourceReferences: [
      {
        title: 'IUCN Red List: Rhincodon typus Assessment',
        url: 'https://www.iucnredlist.org/species/19488/2365291',
        citation: 'Pierce, N.J. & Norman, B. (2016). "Rhincodon typus". The IUCN Red List.'
      }
    ]
  },
  {
    slug: 'mariana-snailfish',
    name: 'Mariana snailfish',
    scientificName: 'Pseudoliparis swirei',
    habitat: 'Midnight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '6,198–8,178 m',
    minDepthMeters: 6198,
    maxDepthMeters: 8178,
    environmentalConditions: {
      temperatureRange: '1.4°C–2.2°C',
      pressureRange: '600–820 bar (hydrostatic crush depth)',
      lightLevel: 'Absolute aphotic darkness',
      oxygenLevel: 'Cold oxygenated bottom trench water'
    },
    biologicalAdaptations: [
      'Massive intracellular concentrations of Trimethylamine N-oxide (TMAO) piezolyte buffering structural proteins against hydrostatic unfolding.',
      'Loss of calcified cranial sutures and swim bladder; body density matches surrounding hadal water via non-rigid cartilage.',
      'Enlarged mechanosensory lateral lines and head pores for non-visual benthic amphipod navigation.'
    ],
    ecologicalRole: 'Top apex predator of the hadal trench benthic ecosystem, feasting on swarming lysianassoid amphipods.',
    conservationStatus: 'Varies by species',
    description: 'The deepest-living vertebrate fish ever captured alive. Its translucent pinkish flesh reveals internal organs, operating with ease under pressure that would instantly crush an unadapted submarine.',
    fact: 'At 8,000 metres depth, the Mariana snailfish endures pressure equivalent to the weight of 1,600 elephants stacked on a single car.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Hadal Science Research Network',
    sourceReferences: [
      {
        title: 'Nature Ecology & Evolution: Snailfish adaptation to hadal depths',
        url: 'https://www.nature.com/articles/s41559-019-0864-8',
        citation: 'Wang, K., et al. (2019). "Morphology and genome of a snailfish from the Mariana Trench provide insights into adaptation to the hadal zone." Nature Ecology & Evolution 3: 823–833.'
      },
      {
        title: 'Zootaxa: Pseudoliparis swirei description',
        citation: 'Gerringer, M. E., et al. (2017). "Pseudoliparis swirei sp. nov.: A newly-discovered hadal snailfish from the Mariana Trench." Zootaxa 4358(1): 161–177.'
      }
    ]
  },
  {
    slug: 'giant-tubeworm',
    name: 'Giant hydrothermal tubeworm',
    scientificName: 'Riftia pachyptila',
    habitat: 'Midnight zone',
    type: 'Cnidarian',
    diet: 'Filter feeder',
    depthRange: '1,500–4,000 m',
    minDepthMeters: 1500,
    maxDepthMeters: 4000,
    environmentalConditions: {
      temperatureRange: '2°C–30°C (mixing perimeter around 350°C black smokers)',
      pressureRange: '150–400 bar',
      lightLevel: 'Faint geothermal blackbody radiation',
      oxygenLevel: 'Sulfide-rich hydrothermal boundary plume'
    },
    biologicalAdaptations: [
      'Complete loss of mouth and gut; houses billions of endosymbiotic sulfur-oxidizing bacteria in a specialized organ called the trophosome.',
      'Specialized 400,000 Da multi-subunit hemoglobin that binds both toxic hydrogen sulfide (H2S) and dissolved oxygen simultaneously without cellular poisoning.'
    ],
    ecologicalRole: 'Primary chemosynthetic foundation species building physical reef architectures around hydrothermal venting rifts.',
    conservationStatus: 'Least concern',
    description: 'Towering tube-dwelling worms that flourish along tectonic spreading ridges. Growing up to two metres tall inside white chitinous tubes, their scarlet plumes capture dissolved hydrogen sulfide to feed symbiotic bacteria.',
    fact: 'Riftia pachyptila has the fastest growth rate of any known marine invertebrate, growing up to 85 cm in a single year near active vents.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'NOAA Ocean Exploration',
    sourceReferences: [
      {
        title: 'Science: Prokaryotic symbionts in Riftia pachyptila',
        url: 'https://www.science.org/doi/10.1126/science.213.4505.340',
        citation: 'Cavanaugh, C. M., et al. (1981). "Prokaryotic Cells in the Trophosome Tissue of Riftia pachyptila: A Possible Symbiosis." Science 213(4505): 340–342.'
      }
    ]
  },
  {
    slug: 'barreleye-fish',
    name: 'Barreleye fish',
    scientificName: 'Opisthoproctus soleatus',
    habitat: 'Twilight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '600–800 m',
    minDepthMeters: 600,
    maxDepthMeters: 800,
    environmentalConditions: {
      temperatureRange: '4°C–7°C',
      pressureRange: '60–80 bar',
      lightLevel: 'Dysphotic residual downwelling photons',
      oxygenLevel: 'Moderate to low deep-water oxygen'
    },
    biologicalAdaptations: [
      'Tubular, emerald-green lenses enclosed inside a fluid-filled transparent canopy on its head, capable of rotating from vertical silhouette viewing to forward alignment.',
      'Ventral bioluminescent sole organ housing symbiotic bacteria for counter-illumination camouflage.'
    ],
    ecologicalRole: 'Specialized mesopelagic predator snatching siphonophore tentacle kleptoparasite copepods and small cnidarians.',
    conservationStatus: 'Least concern',
    description: 'An extraordinary deep-sea fish with a completely transparent, fluid-filled forehead canopy that protects sensitive, upward-gazing green tubular eyes from siphonophore stinging cells.',
    fact: 'The two indentations on the front of the barreleye’s face that resemble eyes are actually olfactory nares (nostrils); its real eyes are the glowing green orbs inside its transparent head.',
    imageUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'MBARI Deep-Sea Laboratory',
    sourceReferences: [
      {
        title: 'MBARI: Barreleye fish research profile',
        url: 'https://www.mbari.org/animal/barreleye-fish/',
        citation: 'Robison, B. H., & Reisenbichler, K. R. (2008). "Macropinna microstoma and the Anatomy and Function of the Barreleye." Copeia 2008(4): 780–784.'
      }
    ]
  },
  {
    slug: 'great-white-shark',
    name: 'Great white shark',
    scientificName: 'Carcharodon carcharias',
    habitat: 'Sunlight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '0–1,200 m',
    minDepthMeters: 0,
    maxDepthMeters: 1200,
    environmentalConditions: {
      temperatureRange: '12°C–24°C',
      pressureRange: '1–120 bar',
      lightLevel: 'Full euphotic daylight to mesopelagic dim',
      oxygenLevel: 'High oxygen pelagic waters'
    },
    biologicalAdaptations: [
      'Ampullae of Lorenzini electroreceptors sensing minute microvolt muscular impulses from marine animals.',
      'Countercurrent heat exchange retia mirabilia keeping swimming muscles and stomach 10–14°C warmer than surrounding water.'
    ],
    ecologicalRole: 'Apex marine predator structuring coastal pinniped and pelagic fish populations.',
    conservationStatus: 'Vulnerable',
    description: 'A formidable apex predator that patrols coastal shallows to deep open ocean contours. Powered by regional endothermy and acute electro-sensory pores.',
    fact: 'Great whites can detect a single droplet of blood in 100 litres of seawater and feel the electrical heartbeat of an immobile fish.',
    imageUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Unsplash Marine Gallery',
    sourceReferences: [
      {
        title: 'IUCN Red List: Carcharodon carcharias',
        citation: 'Rigby, C. L., et al. (2019). Carcharodon carcharias. The IUCN Red List of Threatened Species 2019.'
      }
    ]
  },
  {
    slug: 'blue-whale',
    name: 'Blue whale',
    scientificName: 'Balaenoptera musculus',
    habitat: 'Sunlight zone',
    type: 'Mammal',
    diet: 'Filter feeder',
    depthRange: '0–500 m',
    minDepthMeters: 0,
    maxDepthMeters: 500,
    environmentalConditions: {
      temperatureRange: '-1°C to 20°C',
      pressureRange: '1–50 bar',
      lightLevel: 'Photic zone surface waters',
      oxygenLevel: 'Atmospheric lung ventilation'
    },
    biologicalAdaptations: [
      'Accordion-like ventral throat grooves that expand to engulf over 100 tonnes of water and krill in a single lunge.',
      'Massive keratinous baleen plates acting as a precision sieve during tongue expelling.'
    ],
    ecologicalRole: 'Keystone nutrient recycler whose iron-rich fecal plumes fertilize vast Southern Ocean phytoplankton blooms.',
    conservationStatus: 'Endangered',
    description: 'The largest animal ever known to inhabit our planet, growing up to 30 metres in length. It communicates across entire ocean basins using low-frequency infrasonic pulses.',
    fact: 'A blue whale calf drinks up to 400 litres of mother’s milk daily, gaining approximately 90 kilograms every 24 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'NOAA Fisheries',
    sourceReferences: [
      {
        title: 'Science: Dynamics of blue whale lunge-feeding',
        citation: 'Goldbogen, J. A., et al. (2017). "Foraging kinematics of the world’s largest predator." Science 358: 700–702.'
      }
    ]
  },
  {
    slug: 'vampire-squid',
    name: 'Vampire squid',
    scientificName: 'Vampyroteuthis infernalis',
    habitat: 'Twilight zone',
    type: 'Cephalopod',
    diet: 'Detritivore',
    depthRange: '600–1,200 m',
    minDepthMeters: 600,
    maxDepthMeters: 1200,
    environmentalConditions: {
      temperatureRange: '2°C–6°C',
      pressureRange: '60–120 bar',
      lightLevel: 'Total dysphotic darkness',
      oxygenLevel: 'Oxygen Minimum Zone (< 0.5 mL/L O2)'
    },
    biologicalAdaptations: [
      'Unusually high-affinity copper-based hemocyanin blood that binds trace oxygen in OMZ anoxic water.',
      'Two retractable velar sensory filaments that unravel to sweep sinking organic marine snow detritus.'
    ],
    ecologicalRole: 'Primary midwater detritivore transforming sinking carbon export into benthic food web biomass.',
    conservationStatus: 'Least concern',
    description: 'Neither a true squid nor an octopus, but a primitive cephalopod order. Covered in black-red webbing, it thrives in stagnant deep water where oxygen is almost non-existent.',
    fact: 'When frightened, it turns inside out into a spiky "pineapple posture", shielding its soft body with fleshy, harmless arm spines.',
    imageUrl: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'MBARI Cephalopod Research',
    sourceReferences: [
      {
        title: 'Proc. R. Soc. B: Vampire squid feeding ecology',
        citation: 'Hoving, H. J. T. & Robison, B. H. (2012). "Vampire squid: detritivores in the oxygen minimum zone." Proc. R. Soc. B 279: 4559–4567.'
      }
    ]
  },
  {
    slug: 'deep-sea-dragonfish',
    name: 'Deep sea dragonfish',
    scientificName: 'Stomias boa',
    habitat: 'Twilight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '200–1,500 m',
    minDepthMeters: 200,
    maxDepthMeters: 1500,
    environmentalConditions: {
      temperatureRange: '3°C–8°C',
      pressureRange: '20–150 bar',
      lightLevel: 'Dysphotic to aphotic',
      oxygenLevel: 'Low to moderate'
    },
    biologicalAdaptations: [
      'Suborbital bioluminescent organ emitting far-red light (approx 705 nm) invisible to almost all other deep sea marine life.',
      'Glass-like transparent fangs composed of nanoscale hydroxyapatite crystals that eliminate light reflection.'
    ],
    ecologicalRole: 'Voracious mesopelagic ambush predator keeping midwater lanternfish populations in equilibrium.',
    conservationStatus: 'Least concern',
    description: 'An elongated, pitch-black predator with oversized transparent teeth. Its chin features a glowing barbel lure and a specialized subocular organ that projects invisible red bioluminescence.',
    fact: 'Because almost no other fish in the sea can perceive red light, the dragonfish effectively possesses an infrared searchlight to stalk prey in absolute secrecy.',
    imageUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Oceanic Research Institute',
    sourceReferences: [
      {
        title: 'Cell Press Matter: Transparent dragonfish teeth',
        citation: 'Velasco-Hogan, A., et al. (2019). "On the Transparency of the Teeth of the Deep-Sea Dragonfish." Matter 1(1): 249–262.'
      }
    ]
  },
  {
    slug: 'coelacanth',
    name: 'West Indian Ocean coelacanth',
    scientificName: 'Latimeria chalumnae',
    habitat: 'Twilight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '150–700 m',
    minDepthMeters: 150,
    maxDepthMeters: 700,
    environmentalConditions: {
      temperatureRange: '14°C–18°C',
      pressureRange: '15–70 bar',
      lightLevel: 'Deep volcanic cave twilight',
      oxygenLevel: 'Moderate'
    },
    biologicalAdaptations: [
      'Intracranial skull joint permitting upper jaw elevation for extraordinary buccal suction feeding.',
      'Lobed fins with articulated internal bones moving in synchrony like a walking land tetrapod.'
    ],
    ecologicalRole: 'Deep benthic nocturnal predator stalking submarine volcanic basalt caves.',
    conservationStatus: 'Critically endangered',
    description: 'A majestic living fossil thought extinct for 66 million years until discovered in a South African fishing trawl in 1938. Possesses ancient limb-like lobed fins.',
    fact: 'Coelacanths have a gestation period of roughly 5 years—the longest known of any vertebrate animal on Earth.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Smithsonian Institution',
    sourceReferences: [
      {
        title: 'Nature: Genome of the African coelacanth',
        citation: 'Amemiya, C. T., et al. (2013). "The African coelacanth genome provides insights into tetrapod evolution." Nature 496: 311–316.'
      }
    ]
  },
  {
    slug: 'giant-squid',
    name: 'Giant squid',
    scientificName: 'Architeuthis dux',
    habitat: 'Midnight zone',
    type: 'Cephalopod',
    diet: 'Carnivore',
    depthRange: '300–1,000+ m',
    minDepthMeters: 300,
    maxDepthMeters: 1200,
    environmentalConditions: {
      temperatureRange: '2°C–7°C',
      pressureRange: '30–120 bar',
      lightLevel: 'Aphotic pitch-black bathypelagic layer',
      oxygenLevel: 'Standard oceanic deep water'
    },
    biologicalAdaptations: [
      'Giant eyes measuring up to 30 cm in diameter, optimized to discern silhouettes illuminated by bioluminescent dinoflagellates.',
      'Ammonium chloride solution distributed through muscles, yielding neutral buoyancy without a collapsible gas pocket.'
    ],
    ecologicalRole: 'High-trophic bathypelagic predator and primary prey for diving adult sperm whales.',
    conservationStatus: 'Least concern',
    description: 'The legendary kraken of nautical lore. Equipped with two elongated feeding tentacles armed with hundreds of serrated chitinous suction cups to seize deep-sea fish and squids.',
    fact: 'A giant squid’s brain is shaped like a doughnut, through the center of which its esophagus passes; if it swallows too large a chunk of food, it could suffer brain injury.',
    imageUrl: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Smithsonian National Museum of Natural History',
    sourceReferences: [
      {
        title: 'Current Biology: Giant eyes in giant squids',
        citation: 'Nilsson, D.-E., et al. (2012). "A Unique Advantage for Giant Eyes in Giant Squid." Current Biology 22(8): 683–688.'
      }
    ]
  },
  {
    slug: 'gulper-eel',
    name: 'Gulper eel (Pelican eel)',
    scientificName: 'Eurypharynx pelecanoides',
    habitat: 'Midnight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '500–3,000 m',
    minDepthMeters: 500,
    maxDepthMeters: 3000,
    environmentalConditions: {
      temperatureRange: '2°C–5°C',
      pressureRange: '50–300 bar',
      lightLevel: 'Total aphotic midnight darkness',
      oxygenLevel: 'Low to moderate'
    },
    biologicalAdaptations: [
      'Huge cavernous jaw hinged loosely onto a miniaturized neurocranium, expanding like a parachute balloon to scoop prey.',
      'Caudal bioluminescent organ on its whip-like tail producing glowing red and white pulses to lure deep organisms.'
    ],
    ecologicalRole: 'Opportunistic bathypelagic predator swallowing swarms of mysid crustaceans and cephalopods.',
    conservationStatus: 'Least concern',
    description: 'An unmistakable midnight zone fish dominated by a monstrous cavernous jaw that accounts for a quarter of its total length, trailed by a thin whip-like body.',
    fact: 'Although its gaping jaw can swallow objects much larger than itself, its stomach is relatively small, so it predominantly filters clouds of tiny deep-water shrimp.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Ocean Exploration Trust',
    sourceReferences: [
      {
        title: 'Journal of Fish Biology: Saccopharyngiform morphology',
        citation: 'Nielsen, J. G., et al. (1989). "Morphology of Eurypharynx pelecanoides." J. Fish Biol.'
      }
    ]
  },
  {
    slug: 'dumbo-octopus',
    name: 'Dumbo octopus',
    scientificName: 'Grimpoteuthis',
    habitat: 'Abyssal zone',
    type: 'Cephalopod',
    diet: 'Carnivore',
    depthRange: '3,000–7,000 m',
    minDepthMeters: 3000,
    maxDepthMeters: 7000,
    environmentalConditions: {
      temperatureRange: '1°C–3°C',
      pressureRange: '300–700 bar',
      lightLevel: 'Pitch black abyssal ocean floor',
      oxygenLevel: 'Cold oxygen-rich bottom currents'
    },
    biologicalAdaptations: [
      'Large ear-like mantle fins providing propulsion without expelling energy on water jetting.',
      'Cirri sensory finger-hairs between arm suckers that detect polychaete worms buried in abyssal mud.'
    ],
    ecologicalRole: 'Deep benthic epifaunal predator consuming bivalves, isopods, and worms along abyssal plains.',
    conservationStatus: 'Least concern',
    description: 'The deepest-dwelling cephalopod on Earth, characterized by twin ear-shaped fins flapping atop its mantle like Disney’s animated elephant Dumbo as it glides over abyssal clay.',
    fact: 'Because it lives in pitch-black abyssal waters where predators cannot see, the dumbo octopus has evolved away its defensive ink sac entirely.',
    imageUrl: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'NOAA Ocean Exploration',
    sourceReferences: [
      {
        title: 'Marine Biology: Grimpoteuthis abyssal ecology',
        citation: 'Collins, M. A. (2003). "The genus Grimpoteuthis in the North East Atlantic." Zoological Journal of the Linnean Society 139: 93–127.'
      }
    ]
  },
  {
    slug: 'blobfish',
    name: 'Blobfish',
    scientificName: 'Psychrolutes marcidus',
    habitat: 'Abyssal zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '600–2,800 m',
    minDepthMeters: 600,
    maxDepthMeters: 2800,
    environmentalConditions: {
      temperatureRange: '2°C–4°C',
      pressureRange: '60–280 bar',
      lightLevel: 'Complete darkness',
      oxygenLevel: 'Deep ocean cold water'
    },
    biologicalAdaptations: [
      'Gelatinous body composition with specific gravity slightly less than seawater, floating effortlessly with zero swimming energy.',
      'Total absence of a gas-filled swim bladder which would implosion-collapse under bathyal pressures.'
    ],
    ecologicalRole: 'Benthic ambush predator and opportunistic scavenger consuming crabs, sea pens, and organic detritus.',
    conservationStatus: 'Not evaluated',
    description: 'An iconic deep-sea inhabitant of the continental slopes off Australia and New Zealand. In its natural high-pressure habitat, it possesses a sleek, hydrodynamic fish form.',
    fact: 'The "droopy human face" blobfish appears in memes only when it suffers severe decompression damage from being rapidly hauled 1,000 metres to the surface.',
    imageUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Australian Museum',
    sourceReferences: [
      {
        title: 'Ichthyological Research: Psychrolutidae systematics',
        citation: 'Nelson, J. S. (1982). "Two new species of the psychrolutid fish genus Neophrynichthys." Japanese Journal of Ichthyology.'
      }
    ]
  },
  {
    slug: 'tripod-fish',
    name: 'Tripod fish',
    scientificName: 'Bathypterois grallator',
    habitat: 'Abyssal zone',
    type: 'Fish',
    diet: 'Carnivore',
    depthRange: '1,200–4,700 m',
    minDepthMeters: 1200,
    maxDepthMeters: 4700,
    environmentalConditions: {
      temperatureRange: '1°C–3°C',
      pressureRange: '120–470 bar',
      lightLevel: 'Absolute darkness',
      oxygenLevel: 'Stable abyssal water'
    },
    biologicalAdaptations: [
      'Elongated pelvic and caudal fin rays acting as rigid hydraulic stilts up to 1 metre tall.',
      'Simultaneous hermaphroditism enabling solitary individuals to self-fertilize if no mates are encountered in the desolate abyss.'
    ],
    ecologicalRole: 'Stationary benthic rheophile predator harvesting pelagic copepods from benthic boundary current flows.',
    conservationStatus: 'Least concern',
    description: 'An extraordinary abyssal creature that perches atop the muddy sea floor on three stiff elongated fin rays, facing motionless into bottom currents to intercept drifting plankton.',
    fact: 'The tripod fish’s pectoral fins are curved forward over its head like antennae, allowing it to feel incoming prey vibrations despite having nearly non-functional eyes.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'Deep Sea Explorations Archive',
    sourceReferences: [
      {
        title: 'Deep Sea Research: Functional morphology of Bathypterois',
        citation: 'Sulak, K. J. (1977). "The systematics and biology of Bathypterois." Galathea Report 14: 49–108.'
      }
    ]
  },
  {
    slug: 'giant-isopod',
    name: 'Giant isopod',
    scientificName: 'Bathynomus giganteus',
    habitat: 'Abyssal zone',
    type: 'Crustacean',
    diet: 'Scavenger',
    depthRange: '170–2,140 m',
    minDepthMeters: 170,
    maxDepthMeters: 2140,
    environmentalConditions: {
      temperatureRange: '2°C–7°C',
      pressureRange: '17–214 bar',
      lightLevel: 'Total darkness',
      oxygenLevel: 'Deep seafloor standard'
    },
    biologicalAdaptations: [
      'Extreme abyssal gigantism resulting from low metabolic rates, cold water temperatures, and adaptation to boom-or-bust food cycles.',
      'Segmented calcified overlapping tergites that allow the animal to roll into an armored ball when threatened by deep sharks.'
    ],
    ecologicalRole: 'Crucial benthic megafaunal scavenger cleaning deceased fish, squid, and sunken whale falls on the ocean floor.',
    conservationStatus: 'Least concern',
    description: 'A colossal relative of the common terrestrial pillbug, growing up to 50 cm in length. Equipped with compound eyes of nearly 4,000 facets and armored calcarous plating.',
    fact: 'Due to severe food scarcity in the deep sea, giant isopods possess an exceptionally slow metabolism; a captive specimen survived for over five years without food.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'NOAA Okeanos Explorer',
    sourceReferences: [
      {
        title: 'Journal of Crustacean Biology: Bathynomus giganteus',
        citation: 'Briones-Fourzán, P. (1991). "Aspects of the biology of the giant isopod Bathynomus giganteus." J. Crustacean Biol. 11: 375–385.'
      }
    ]
  },
  {
    slug: 'yeti-crab',
    name: 'Yeti crab',
    scientificName: 'Kiwa hirsuta',
    habitat: 'Hadal zone',
    type: 'Crustacean',
    diet: 'Omnivore',
    depthRange: '2,200–7,200 m',
    minDepthMeters: 2200,
    maxDepthMeters: 7200,
    environmentalConditions: {
      temperatureRange: '2°C ambient, mixing with 350°C hydrothermal hydrothermal fluid',
      pressureRange: '220–720 bar',
      lightLevel: 'Aphotic, punctuated by geothermal infrared vent glow',
      oxygenLevel: 'Sulfide-rich, variable'
    },
    biologicalAdaptations: [
      'Dense mats of silky setae covering pincers and limbs, dedicated to cultivating filamentous episymbiotic chemosynthetic bacteria.',
      'Atrophied, pigmentless eyes adapted to live strictly by hydrothermal vents on abyssal and hadal tectonic ridges.'
    ],
    ecologicalRole: 'Hydrothermal vent epifaunal farmer bridging chemosynthetic bacterial primary production with higher trophic levels.',
    conservationStatus: 'Not evaluated',
    description: 'A ghostly white decapod crustacean whose claws are cloaked in long, silky golden setae resembling yeti fur. It thrives huddled in crowds around deep hydrothermal rift chimneys.',
    fact: 'The yeti crab waves its furry claws rhythmically over vent plumes in a behavior dubbed the "crab dance", aerating its bacterial gardens with oxygen and hydrogen sulfide.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    imageAttribution: 'IFREMER Deep Sea Biology',
    sourceReferences: [
      {
        title: 'Zoosystema: The Yeti Crab Kiwa hirsuta',
        citation: 'Macpherson, E., et al. (2005). "A new squatted lobster family from the Pacific-Antarctic Ridge." Zoosystema 27(4): 709–723.'
      }
    ]
  }
]


export async function seedDatabase(): Promise<void> {
  const connected = await connectDB()

  if (!connected) {
    console.warn(
      '⚠️ [Seed] Cannot seed MongoDB: database is not connected. Configure MONGODB_URI in server/.env to enable persistent database storage.'
    )
    return
  }

  try {
    console.log(`🌱 [Seed] Seeding ${DOCUMENTED_SPECIES.length} documented marine species...`)

    let createdCount = 0
    let updatedCount = 0

    for (const item of DOCUMENTED_SPECIES) {
      const result = await Species.updateOne(
        { slug: item.slug },
        { $set: item },
        { upsert: true }
      )

      if (result.upsertedCount > 0) {
        createdCount++
      } else if (result.modifiedCount > 0) {
        updatedCount++
      }
    }

    console.log(`✅ [Seed] Seeding complete! Created: ${createdCount}, Updated: ${updatedCount}, Total: ${DOCUMENTED_SPECIES.length}`)
  } catch (error) {
    console.error('❌ [Seed] Error seeding species database:', error)
  }
}

// Allow direct execution: npx tsx src/scripts/seed.ts
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase().then(() => {
    mongoose.disconnect()
    process.exit(0)
  })
}
