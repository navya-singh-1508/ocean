import type { Creature, QuizQuestionItem } from './types'

export const creatures: Creature[] = [
  // ── SUNLIGHT ZONE (0–200 m) ───────────────────────────
  {
    id: 'turtle',
    slug: 'green-sea-turtle',
    name: 'Green sea turtle',
    scientific: 'Chelonia mydas',
    zone: 'Sunlight zone',
    type: 'Reptile',
    diet: 'Herbivore',
    depth: '0–200 m',
    status: 'Endangered',
    description: 'A graceful ocean wanderer that migrates thousands of kilometres between foraging seagrass pastures and natal nesting beaches. Adults graze primarily on marine algae and seagrass.',
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1000&q=85',
    fact: 'Green sea turtles possess specialized orbital salt glands behind their eyes that excrete concentrated salt crystals, appearing to "cry" on land.',
    biologicalAdaptations: [
      'Lachrymal salt glands for excreting hyperosmotic brine while preserving internal freshwater balance.',
      'Hydrodynamic tear-drop carapace reducing drag during transoceanic migratory crossings.',
      'Serrated horny jaw sheath adapted for cropping tough seagrass blades and macroalgae.'
    ],
    sourceReferences: [
      { title: 'IUCN Red List: Chelonia mydas', citation: 'Seminoff, J.A. (2004). "Chelonia mydas". IUCN Red List.', url: 'https://www.iucnredlist.org' },
      { title: 'NOAA Fisheries: Green Turtle Profile', citation: 'NOAA Fisheries Office of Protected Resources (2023).' }
    ]
  },
  {
    id: 'clownfish',
    slug: 'clownfish',
    name: 'Clownfish',
    scientific: 'Amphiprioninae',
    zone: 'Sunlight zone',
    type: 'Fish',
    diet: 'Omnivore',
    depth: '1–15 m',
    status: 'Least concern',
    description: 'Vividly coloured coral reef fish famous for their mutualistic partnership with venomous sea anemones, sheltered by an innate chemical mucus shield.',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1000&q=85',
    fact: 'All clownfish hatch as males; when the dominant breeding female in a hierarchy dies, the largest male transitions into the new reproductive female.',
    biologicalAdaptations: [
      'Chemically camouflage mucus coating lacking N-acetylgalactosamine, preventing nematocyst trigger discharge.',
      'Sequential protandrous hermaphroditism guaranteeing ongoing group reproductive continuity.'
    ],
    sourceReferences: [
      { title: 'FishBase: Amphiprion ocellaris', citation: 'Froese, R. and D. Pauly. Editors (2023). FishBase publication.' }
    ]
  },
  {
    id: 'dolphin',
    slug: 'bottlenose-dolphin',
    name: 'Bottlenose dolphin',
    scientific: 'Tursiops truncatus',
    zone: 'Sunlight zone',
    type: 'Mammal',
    diet: 'Carnivore',
    depth: '0–300 m',
    status: 'Least concern',
    description: 'Renowned for exceptional cognitive intelligence and complex vocal societies, dolphins deploy directional biosonar clicks to map underwater topography and hunt schooling fish.',
    image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=1000&q=85',
    fact: 'Dolphins produce ultrasonic clicks focused through a lipid-dense melon organ in their forehead, resolving objects as small as a pebble over 100 metres away.',
    biologicalAdaptations: [
      'Biosonar melon concentrating clicks up to 130 kHz for three-dimensional echolocation.',
      'Countercurrent vascular heat exchangers in flukes and dorsal fin retaining arterial warmth in cold dives.'
    ],
    sourceReferences: [
      { title: 'Marine Mammal Science: Delphinid Biosonar', citation: 'Au, W. W. L. (1993). The Sonar of Dolphins. Springer-Verlag.' }
    ]
  },
  {
    id: 'manta',
    slug: 'giant-manta-ray',
    name: 'Giant manta ray',
    scientific: 'Mobula birostris',
    zone: 'Sunlight zone',
    type: 'Ray',
    diet: 'Filter feeder',
    depth: '0–1,000 m',
    status: 'Endangered',
    description: 'The world’s largest ray with a wingspan reaching over 7 metres. It executes sweeping somersaults through zooplankton clouds, channeling food into its cavernous mouth with cephalic lobes.',
    image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
    fact: 'Giant manta rays possess the highest brain-to-body mass ratio of any cold-blooded fish, exhibiting self-recognition indicators in mirror tests.',
    biologicalAdaptations: [
      'Pliable cartilaginous gill rakers acting as non-clogging cross-flow filtration sieve membranes.',
      'Encephalized sensory cortex with retia mirabilia supplying heated blood to the brain and eyes.'
    ],
    sourceReferences: [
      { title: 'Biology Letters: Mobula birostris cognitive ecology', citation: 'Ari, C. & D’Agostino, D. P. (2016). Biology Letters 12(3).' }
    ]
  },
  {
    id: 'shark',
    slug: 'whale-shark',
    name: 'Whale shark',
    scientific: 'Rhincodon typus',
    zone: 'Sunlight zone',
    type: 'Fish',
    diet: 'Filter feeder',
    depth: '0–1,900 m',
    status: 'Endangered',
    description: 'The largest extant non-mammalian vertebrate, reaching lengths of up to 18 metres. Characterized by a checkerboard of pale yellow spots and stripes unique to each individual.',
    image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1000&q=85',
    fact: 'Whale sharks possess over 3,000 microscopic teeth arranged in 300 rows, yet they do not use them to chew, filtering plankton entirely across spongy gill pads.',
    biologicalAdaptations: [
      'Cross-flow filtration pads capturing organisms down to 1 mm while purging excess water continuously.',
      'Dermal denticles shielding the eyeball surfaces in place of eyelids.'
    ],
    sourceReferences: [
      { title: 'Smithsonian Tropical Research Institute', citation: 'Guzman, H. M., et al. (2018). Whale shark vertical movements and epipelagic foraging.' }
    ]
  },
  {
    id: 'great-white',
    slug: 'great-white-shark',
    name: 'Great white shark',
    scientific: 'Carcharodon carcharias',
    zone: 'Sunlight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '0–1,200 m',
    status: 'Vulnerable',
    description: 'An apex oceanic predator equipped with regional endothermy and sensitive electroreceptive ampullae that detect tiny electrical fields generated by moving prey.',
    image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1000&q=85',
    fact: 'Great whites maintain their stomach and muscle temperatures up to 14°C warmer than surrounding ocean water using a countercurrent heat exchange network.',
    biologicalAdaptations: [
      'Ampullae of Lorenzini pores sensing nanovolt electrical pulses generated by muscular contractions.',
      'Rete mirabile vascular countercurrent network maintaining core muscular endothermy.'
    ],
    sourceReferences: [
      { title: 'Nature: Endothermy in lamnid sharks', citation: 'Carey, F. G., et al. (1982). Warm-bodied fishes. Science.' }
    ]
  },
  {
    id: 'blue-whale',
    slug: 'blue-whale',
    name: 'Blue whale',
    scientific: 'Balaenoptera musculus',
    zone: 'Sunlight zone',
    type: 'Mammal',
    diet: 'Filter feeder',
    depth: '0–500 m',
    status: 'Endangered',
    description: 'The largest known animal in Earth’s history, measuring up to 30 metres and weighing near 200 tonnes. A single mouthful can consume up to 4 tonnes of Antarctic krill.',
    image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
    fact: 'A blue whale’s heartbeat can be detected by hydrophones over 3 kilometres away underwater, and its aorta is large enough for an infant to swim through.',
    biologicalAdaptations: [
      'Expandable ventral groove pleats stretching during lunge-feeding to engulf volume exceeding the whale’s own body mass.',
      'Comb-like keratinous baleen plates straining krill from thousands of litres of expelled seawater.'
    ],
    sourceReferences: [
      { title: 'Journal of Experimental Biology', citation: 'Goldbogen, J. A., et al. (2011). Mechanics, hydrodynamics and energetics of blue whale lunge feeding.' }
    ]
  },

  // ── TWILIGHT ZONE (200–1,000 m) ────────────────────────
  {
    id: 'jellyfish',
    slug: 'moon-jellyfish',
    name: 'Moon jellyfish',
    scientific: 'Aurelia aurita',
    zone: 'Twilight zone',
    type: 'Cnidarian',
    diet: 'Carnivore',
    depth: '0–1,000 m',
    status: 'Not evaluated',
    description: 'A translucent pelagic medusa that drifts with ocean currents. Four distinct horseshoe-shaped gonads glow faintly through its bell as it sweeps micro-plankton with fine fringe tentacles.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    fact: 'Moon jellyfish bodies are 95% water and lack brains, hearts, and respiratory systems, exchanging oxygen directly across their thin epidermal membranes.',
    biologicalAdaptations: [
      'Marginal rhopalia sensory structures containing statocysts and photoreceptor ocelli for orienting against gravity.',
      'Mucus-coated exumbrella surface trapping micro-crustaceans and transporting them to oral arms via ciliary currents.'
    ],
    sourceReferences: [
      { title: 'Marine Ecology Progress Series', citation: 'Lucas, C. H. (2001). Reproduction and life history strategies of the common jellyfish, Aurelia aurita.' }
    ]
  },
  {
    id: 'barreleye',
    slug: 'barreleye-fish',
    name: 'Barreleye fish',
    scientific: 'Macropinna microstoma',
    zone: 'Twilight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '600–800 m',
    status: 'Least concern',
    description: 'An iconic mesopelagic fish possessing tubular green eyes housed entirely inside a transparent fluid-filled skull dome, optimized to spot silhouettes against residual downwelling light.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    fact: 'The two dark spots on the front of its head are olfactory nares (nostrils); its actual eyes are the glowing emerald spheres gazing upward inside its glass head.',
    biologicalAdaptations: [
      'Rotatable tubular eyes encased in a transparent fluid-shielded cranial canopy protecting lenses from siphonophore nematocysts.',
      'Broad horizontal fins enabling hovering with surgical precision without creating water disturbances.'
    ],
    sourceReferences: [
      { title: 'MBARI Deep-Sea Laboratory Report', citation: 'Robison, B. H. & Reisenbichler, K. R. (2008). Copeia 2008(4): 780–784.' }
    ]
  },
  {
    id: 'vampire-squid',
    slug: 'vampire-squid',
    name: 'Vampire squid',
    scientific: 'Vampyroteuthis infernalis',
    zone: 'Twilight zone',
    type: 'Cephalopod',
    diet: 'Detritivore',
    depth: '600–1,200 m',
    status: 'Least concern',
    description: 'Neither a true squid nor an octopus, but a unique relict cephalopod. Encased in a jet-black webbing of skin, it thrives in deep-sea oxygen minimum zones with near-zero oxygen.',
    image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    fact: 'Instead of ink, the vampire squid releases a glowing cloud of bioluminescent mucus containing thousands of glowing photophores to confuse predators.',
    biologicalAdaptations: [
      'Specialized hemocyanin copper blood with extraordinary oxygen-binding affinity functioning at under 3% dissolved oxygen.',
      'Pair of retractable sensory filaments deploying like fishing lines to collect sinking "marine snow" detritus.'
    ],
    sourceReferences: [
      { title: 'Proceedings of the Royal Society B', citation: 'Hoving, H. J. T. & Robison, B. H. (2012). Vampire squid: detritivores in the oxygen minimum zone.' }
    ]
  },
  {
    id: 'dragonfish',
    slug: 'deep-sea-dragonfish',
    name: 'Deep sea dragonfish',
    scientific: 'Stomias boa',
    zone: 'Twilight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '200–1,500 m',
    status: 'Least concern',
    description: 'A fearsome ambush predator of the mesopelagic depths. Equipped with needle-sharp transparent fangs so large the fish cannot fully close its mouth.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    fact: 'Dragonfish are among the very few deep-sea organisms that produce red bioluminescent light, functioning as an invisible infrared sniper scope that other deep fish cannot detect.',
    biologicalAdaptations: [
      'Suborbital photophore emitting long-wavelength red light invisible to prey species.',
      'Nanostructured transparent teeth containing hydroxyapatite that scatter zero incident light.'
    ],
    sourceReferences: [
      { title: 'Matter / Cell Press', citation: 'Velasco-Hogan, A., et al. (2019). On the transparency of the teeth of the deep-sea dragonfish.' }
    ]
  },
  {
    id: 'coelacanth',
    slug: 'coelacanth',
    name: 'West Indian Ocean coelacanth',
    scientific: 'Latimeria chalumnae',
    zone: 'Twilight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '150–700 m',
    status: 'Critically endangered',
    description: 'A celebrated "living fossil" belonging to an ancient lobe-finned lineage believed to have gone extinct with the dinosaurs 66 million years ago until rediscovered alive in 1938.',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    fact: 'Coelacanths possess an intracranial hinge joint in their skull that allows them to lift the upper jaw independently, opening their mouth unusually wide to swallow large prey.',
    biologicalAdaptations: [
      'Lobate paired fins supported by internal skeletal bones moving in an alternating tetrapod-like gait.',
      'Rostral organ in the snout functioning as an electroreceptive navigational gel matrix.'
    ],
    sourceReferences: [
      { title: 'Nature: The coelacanth genome', citation: 'Amemiya, C. T., et al. (2013). Nature 496: 311–316.' }
    ]
  },

  // ── MIDNIGHT ZONE (1,000–4,000 m) ─────────────────────
  {
    id: 'anglerfish',
    slug: 'anglerfish',
    name: 'Deep-sea anglerfish',
    scientific: 'Melanocetus johnsonii',
    zone: 'Midnight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '1,000–3,000 m',
    status: 'Least concern',
    description: 'The definitive midnight zone predator. Females possess a modified dorsal fin spine tipped with a bioluminescent lure called an esca that illuminates the pitch-black abyss.',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85',
    fact: 'In many anglerfish species, tiny dwarf males find females using acute scent organs and fuse their bloodstream permanently into the female’s body as lifelong parasite mates.',
    biologicalAdaptations: [
      'Illicium fishing rod apparatus harboring symbiotic Photobacterium bioluminescent bacteria.',
      'Expandable stomach and flexible jaw hinge permitting ingestion of prey twice their own body size.'
    ],
    sourceReferences: [
      { title: 'Oceanic Anglerfishes Taxonomy', citation: 'Pietsch, T. W. (2009). Oceanic Anglerfishes. University of California Press.' }
    ]
  },
  {
    id: 'giant-squid',
    slug: 'giant-squid',
    name: 'Giant squid',
    scientific: 'Architeuthis dux',
    zone: 'Midnight zone',
    type: 'Cephalopod',
    diet: 'Carnivore',
    depth: '300–1,000+ m',
    status: 'Least concern',
    description: 'A colossal deep-sea predator growing up to 13 metres in length. It possesses the largest eyes in the entire animal kingdom, measuring up to 30 cm across to detect faint shadows.',
    image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    fact: 'The giant squid’s eyes are the size of dinner plates, designed specifically to detect the bioluminescent wake created when sperm whales displace deep-sea plankton.',
    biologicalAdaptations: [
      'Dinner-plate diameter eyes gathering faint bioluminescent signatures in the midnight bathypelagic layer.',
      'Neutral buoyancy regulated by ammonium chloride storage in muscle tissues rather than a gas-filled bladder.'
    ],
    sourceReferences: [
      { title: 'Current Biology: Giant squid visual ecology', citation: 'Nilsson, D.-E., et al. (2012). Current Biology 22(8): 683–688.' }
    ]
  },
  {
    id: 'gulper-eel',
    slug: 'gulper-eel',
    name: 'Gulper eel (Pelican eel)',
    scientific: 'Eurypharynx pelecanoides',
    zone: 'Midnight zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '500–3,000 m',
    status: 'Least concern',
    description: 'Famous for its enormous pouch-like jaws that can unhinge to engulf crustaceans or fish far larger than the eel’s own body. The end of its slender tail features a luminous red lure.',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85',
    fact: 'Despite its monstrous jaw, the gulper eel’s stomach is surprisingly tiny, suggesting it primarily scoops swarms of small bathypelagic shrimp rather than giant monsters.',
    biologicalAdaptations: [
      'Distensible jaw with elastic pharynx capable of opening like a pelican’s pouch.',
      'Complex caudal organ on tail tip emitting glowing red bioluminescent pulses to entice curious prey.'
    ],
    sourceReferences: [
      { title: 'Copeia: Anatomical specializations of Eurypharynx', citation: 'Nielsen, J. G., et al. (1989). Gulper eel anatomy and feeding mechanics.' }
    ]
  },
  {
    id: 'giant-tubeworm',
    slug: 'giant-tubeworm',
    name: 'Giant hydrothermal tubeworm',
    scientific: 'Riftia pachyptila',
    zone: 'Midnight zone',
    type: 'Cnidarian',
    diet: 'Filter feeder',
    depth: '1,500–4,000 m',
    status: 'Least concern',
    description: 'Thriving around superheated volcanic hydrothermal vents, these crimson-plumed worms grow inside tall white chitin tubes, entirely fueled by chemosynthetic sulfur bacteria.',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    fact: 'Riftia has zero digestive mouth or gut; its multi-subunit hemoglobin binds toxic hydrogen sulfide gas directly from vent fluids to feed billions of internal bacterial partners.',
    biologicalAdaptations: [
      'Trophosome organ housing chemosynthetic sulfide-oxidizing endosymbiotic bacteria.',
      'Dual-binding giant hemoglobin molecules transporting toxic H2S and oxygen simultaneously without poisoning.'
    ],
    sourceReferences: [
      { title: 'Science: Chemosymbiosis in Riftia pachyptila', citation: 'Cavanaugh, C. M., et al. (1981). Science 213: 340–342.' }
    ]
  },

  // ── ABYSSAL ZONE (4,000–6,000 m) ──────────────────────
  {
    id: 'dumbo',
    slug: 'dumbo-octopus',
    name: 'Dumbo octopus',
    scientific: 'Grimpoteuthis',
    zone: 'Abyssal zone',
    type: 'Cephalopod',
    diet: 'Carnivore',
    depth: '3,000–7,000 m',
    status: 'Least concern',
    description: 'The deepest-dwelling octopus known to science. It flaps two distinctive ear-like fins above its mantle to hover serenely just inches above the abyssal sediment.',
    image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    fact: 'Unlike surface octopuses, dumbo octopuses have no ink sacs because releasing dark clouds in a completely pitch-black environment serves zero defensive purpose.',
    biologicalAdaptations: [
      'Pectoral ear-fins providing graceful locomotion without wasting precious metabolic energy on jet propulsion.',
      'Webbed umbrella arms containing sensitive cirri sensory hairs that detect benthic worms in soft mud.'
    ],
    sourceReferences: [
      { title: 'MBARI Deep-Sea Exploration', citation: 'Collins, M. A. & Villanueva, R. (2006). Taxonomy, ecology and behaviour of the Cirrata (Cephalopoda).' }
    ]
  },
  {
    id: 'blobfish',
    slug: 'blobfish',
    name: 'Blobfish',
    scientific: 'Psychrolutes marcidus',
    zone: 'Abyssal zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '600–2,800 m',
    status: 'Not evaluated',
    description: 'Cruelly labeled "the world’s ugliest animal" when depressurized, the blobfish looks completely normal underwater where extreme water pressure holds its gelatinous body together.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    fact: 'The blobfish has almost no structural bone and zero swim bladder; its entire body density is slightly less than seawater, allowing it to float effortlessly above the ocean floor.',
    biologicalAdaptations: [
      'Gelatinous low-density muscle mass that floats without metabolic swimming effort under intense crushing pressure.',
      'Lack of internal gas bladder that would implode or burst during vertical water movement.'
    ],
    sourceReferences: [
      { title: 'Australian Museum Ichthyology', citation: 'Nelson, J. S. (2006). Fishes of the World. John Wiley & Sons.' }
    ]
  },
  {
    id: 'tripod-fish',
    slug: 'tripod-fish',
    name: 'Tripod fish',
    scientific: 'Bathypterois grallator',
    zone: 'Abyssal zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '1,200–4,700 m',
    status: 'Least concern',
    description: 'A bizarre abyssal benthic fish that perches atop the ocean floor on three extraordinarily long, stiffened fin rays that act as stilts, facing into bottom currents to intercept drifting prey.',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85',
    fact: 'The tripod fish stands over 1 metre above the toxic silty boundary layer, using its forward pectoral fins as sensory antennae to feel tiny copepods approaching in total darkness.',
    biologicalAdaptations: [
      'Elongated pelvic and caudal rays stiffened by fluid pressure to function as stationary hydraulic stilts.',
      'Simultaneous hermaphroditism ensuring successful mating even when solitary in vast abyssal plains.'
    ],
    sourceReferences: [
      { title: 'Deep-Sea Research Part I', citation: 'Sulak, K. J. (1977). The systematics and biology of Bathypterois.' }
    ]
  },
  {
    id: 'giant-isopod',
    slug: 'giant-isopod',
    name: 'Giant isopod',
    scientific: 'Bathynomus giganteus',
    zone: 'Abyssal zone',
    type: 'Crustacean',
    diet: 'Scavenger',
    depth: '170–2,140 m',
    status: 'Least concern',
    description: 'A colossal deep-sea relative of the common woodlouse or pillbug. Growing up to 50 cm long, it prowls the abyssal muddy floor scavenging sunken whale falls and marine carrion.',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    fact: 'Because food is so scarce in the abyss, giant isopods can endure years between meals; one captive specimen in Japan survived 5 consecutive years without eating.',
    biologicalAdaptations: [
      'Abyssal gigantism resulting from cold temperatures, high pressure, and adaptation to opportunistic gluttony.',
      'Multi-layered calcified chitin exoskeleton providing protection against crushing hydrostatic compression.'
    ],
    sourceReferences: [
      { title: 'Journal of Crustacean Biology', citation: 'Briones-Fourzán, P. & Lozano-Álvarez, E. (1991). Aspects of the biology of Bathynomus giganteus.' }
    ]
  },

  // ── HADAL ZONE (6,000–11,000 m) ───────────────────────
  {
    id: 'snailfish',
    slug: 'hadal-snailfish',
    name: 'Mariana snailfish',
    scientific: 'Pseudoliparis swirei',
    zone: 'Hadal zone',
    type: 'Fish',
    diet: 'Carnivore',
    depth: '6,000–8,200 m',
    status: 'Least concern',
    description: 'The deepest-living vertebrate fish ever recorded by scientists. Thriving under more than 800 times atmospheric pressure in the pitch-black freezing depths of the Mariana Trench.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    fact: 'Mariana snailfish cells contain extraordinary levels of TMAO (trimethylamine N-oxide), an organic piezolyte chemical that prevents high hydrostatic pressure from crushing their enzymes.',
    biologicalAdaptations: [
      'Ultra-dense cellular concentrations of TMAO stabilizing protein folds under 1,000 bar pressure.',
      'Complete loss of calcified bone in favor of flexible cartilage and absence of a gas swim bladder.'
    ],
    sourceReferences: [
      { title: 'Zootaxa: Pseudoliparis swirei description', citation: 'Gerringer, M. E., et al. (2017). Zootaxa 4358(1): 161–177.' },
      { title: 'Nature Ecology & Evolution', citation: 'Wang, K., et al. (2019). Morphology and molecular adaptations of hadal snailfish.' }
    ]
  },
  {
    id: 'yeti-crab',
    slug: 'yeti-crab',
    name: 'Yeti crab',
    scientific: 'Kiwa hirsuta',
    zone: 'Hadal zone',
    type: 'Crustacean',
    diet: 'Omnivore',
    depth: '2,200–7,200 m',
    status: 'Not evaluated',
    description: 'A ghostly white crab discovered along Pacific-Antarctic hydrothermal ridge fractures. Its pincers and legs are covered in silky golden bristles (setae) dense with symbiotic filamentous bacteria.',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
    fact: 'The yeti crab waves its fuzzy claws back and forth through warm hydrothermal vent fluid to "farm" chemosynthetic bacteria on its hairs, which it then grooms and eats.',
    biologicalAdaptations: [
      'Dense setae hair mats cultivating chemosynthetic sulfur-oxidizing bacteria as a renewable food source.',
      'Reduced, non-functional eyes suited for lives adjacent to geothermal deep-sea thermal vents.'
    ],
    sourceReferences: [
      { title: 'Zoosystema: Kiwa hirsuta description', citation: 'Macpherson, E., Jones, W. & Segonzac, M. (2005). A new squatted lobster family from the Pacific-Antarctic Ridge.' }
    ]
  }
]

// ── 5 PELAGIC OCEAN DEPTH ZONES ────────────────────────
export const zones = [
  {
    name: 'Sunlight zone',
    alternateName: 'Epipelagic Layer',
    depth: '0–200 m',
    pressure: '1–20 bar',
    light: '100% – 1%',
    temperature: '30°C to 12°C',
    note: 'The sunlit euphotic layer where photosynthesis occurs, home to 90% of known marine species, coral reefs, and oceanic megafauna.',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=85',
    icon: '☀'
  },
  {
    name: 'Twilight zone',
    alternateName: 'Mesopelagic Layer',
    depth: '200–1,000 m',
    pressure: '20–100 bar',
    light: '< 1% to Pitch Black',
    temperature: '15°C to 4°C',
    note: 'Faint blue downwelling light fades rapidly. Organisms deploy counterillumination bioluminescence and giant eyes to avoid silhouetting against predators.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1200&q=85',
    icon: '◐'
  },
  {
    name: 'Midnight zone',
    alternateName: 'Bathypelagic Layer',
    depth: '1,000–4,000 m',
    pressure: '100–400 bar',
    light: '0% (Bioluminescence only)',
    temperature: '4°C to 2°C',
    note: 'Perpetual darkness, icy temperatures, and tremendous hydrostatic pressures. Life relies on marine snow drifting from above and specialized light lures.',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=85',
    icon: '☾'
  },
  {
    name: 'Abyssal zone',
    alternateName: 'Abyssopelagic Layer',
    depth: '4,000–6,000 m',
    pressure: '400–600 bar',
    light: 'Absolute Darkness',
    temperature: '2°C to 0°C',
    note: 'Covering 60% of Earth’s surface, the vast muddy abyssal plains harbor tripod fish, dumbo octopuses, and giant isopods enduring crushing weight.',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=85',
    icon: '✦'
  },
  {
    name: 'Hadal zone',
    alternateName: 'Hadalpelagic (Trenches)',
    depth: '6,000–11,000 m',
    pressure: '600–1,100 bar',
    light: 'Absolute Darkness',
    temperature: '1°C to 4°C',
    note: 'The deep V-shaped tectonic ocean chasms like the Mariana Trench. Snailfish and amphipods survive via piezolyte cellular TMAO protection.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1200&q=85',
    icon: '▼'
  }
] as const

// ── EXPANDED 15-QUESTION OCEAN QUIZ ───────────────────
export const quizQuestions: QuizQuestionItem[] = [
  {
    id: 'q1',
    category: 'Marine Ecology',
    question: 'Which ocean animal is the largest known fish currently living on Earth?',
    options: ['Great white shark', 'Whale shark', 'Blue whale', 'Giant manta ray'],
    answer: 1,
    explanation: 'The whale shark (Rhincodon typus) is the largest extant fish, reaching up to 18 metres. The blue whale is larger overall, but it is a marine mammal.'
  },
  {
    id: 'q2',
    category: 'Deep Sea Adaptations',
    question: 'What is bioluminescence, and why is it crucial for deep-sea survival?',
    options: ['Light reflected from the moon', 'Chemical light generated by living organisms', 'Phosphorus dissolved in seawater', 'Heat energy radiated by thermal vents'],
    answer: 1,
    explanation: 'Bioluminescence is light produced by a chemical reaction (typically luciferin + luciferase) inside an organism, used for camouflage, luring prey, and communication.'
  },
  {
    id: 'q3',
    category: 'Ocean Physics',
    question: 'Approximately how much does hydrostatic pressure increase for every 10 metres of ocean depth?',
    options: ['0.1 atmosphere', '1.0 atmosphere / ~1 bar', '10 atmospheres', '100 atmospheres'],
    answer: 1,
    explanation: 'Seawater density (~1025 kg/m³) causes hydrostatic pressure to increase by approximately 1 atmosphere (~1.005 bar) every 10 metres (33 feet) of descent.'
  },
  {
    id: 'q4',
    category: 'Deep Sea Adaptations',
    question: 'How does the Mariana snailfish prevent its proteins and enzymes from being crushed at 8,000 metres depth?',
    options: ['A titanium-hard internal skeleton', 'High cellular concentrations of TMAO (piezolyte)', 'Boiling water generated in its core', 'Constantly swimming toward the surface'],
    answer: 1,
    explanation: 'Hadal snailfish synthesize high levels of trimethylamine N-oxide (TMAO), an organic piezolyte osmolyte that stabilizes protein water structures under crushing pressures.'
  },
  {
    id: 'q5',
    category: 'Marine Ecology',
    question: 'How do dolphins navigate and hunt prey in murky water or pitch-black depths?',
    options: ['Infrared night vision', 'Ultrasonic biosonar (echolocation)', 'Electric sensory whiskers', 'Magnetic skin currents'],
    answer: 1,
    explanation: 'Dolphins emit high-frequency acoustic clicks focused through a lipid-dense forehead organ called the melon, interpreting the returning sound waves to map objects.'
  },
  {
    id: 'q6',
    category: 'Deep Sea Adaptations',
    question: 'What is "counterillumination" camouflage used by mesopelagic animals in the Twilight zone?',
    options: ['Shining bright lights to blind predators', 'Emitting ventral light to match the intensity of downwelling daylight', 'Turning entirely pitch-black', 'Blinking in emergency rhythms'],
    answer: 1,
    explanation: 'Many twilight organisms emit downward-facing light from ventral photophores matching downwelling sunlight, eliminating their dark silhouette from predators looking up.'
  },
  {
    id: 'q7',
    category: 'Ocean Physics',
    question: 'At what approximate ocean depth is 99% of all sunlight completely absorbed and extinguished?',
    options: ['50 metres', '200 metres', '1,000 metres', '3,000 metres'],
    answer: 1,
    explanation: 'By approximately 200 metres (the bottom of the photic or sunlight zone), roughly 99% of solar radiation has been absorbed, leaving only faint blue photons down to 1,000 metres.'
  },
  {
    id: 'q8',
    category: 'Marine Ecology',
    question: 'What primary food source supports complex animal communities around volcanic hydrothermal vents?',
    options: ['Sunlight-grown kelp', 'Chemosynthetic bacteria oxidizing hydrogen sulfide', 'Plastic debris and microfibers', 'Coral polyps carried by currents'],
    answer: 1,
    explanation: 'Hydrothermal vent food webs are powered by chemosynthesis: specialized bacteria oxidize toxic hydrogen sulfide and methane emerging from Earth’s interior to produce sugars.'
  },
  {
    id: 'q9',
    category: 'Deep Sea Adaptations',
    question: 'Why does the Barreleye fish (Macropinna microstoma) have a transparent skull canopy?',
    options: ['To absorb solar radiation for photosynthesis', 'To protect its upward-gazing tubular eyes while snatching food from siphonophores', 'To attract mates with skull flashes', 'To lower its water resistance'],
    answer: 1,
    explanation: 'The fluid-filled transparent canopy allows its sensitive green tubular eyes to look up through its skull to spot silhouettes while protecting them from stinging tentacles.'
  },
  {
    id: 'q10',
    category: 'Ocean Physics',
    question: 'What is the deepest known location in Earth’s oceans, and how deep is it?',
    options: ['Puerto Rico Trench (~8,376 m)', 'Java Trench (~7,450 m)', 'Challenger Deep in the Mariana Trench (~10,928 m)', 'Mid-Atlantic Rift (~5,000 m)'],
    answer: 2,
    explanation: 'Challenger Deep, located in the southern end of the Mariana Trench, plunges to nearly 10,928 metres (almost 36,000 feet) below sea level, where pressure exceeds 1,085 bar.'
  },
  {
    id: 'q11',
    category: 'Marine Ecology',
    question: 'What is a "whale fall" and why is it an ecological oasis in the deep sea?',
    options: ['A migration route used by pods', 'A sunken whale carcass providing nutrient-dense food for decades', 'A submarine underwater waterfall', 'A protective coral reef cave'],
    answer: 1,
    explanation: 'When a whale dies and sinks to the sea floor, its massive carcass provides hundreds of tons of organic nutrients, supporting succession communities of scavengers and bone-eating worms for over 50 years.'
  },
  {
    id: 'q12',
    category: 'Deep Sea Adaptations',
    question: 'Why do giant deep-sea isopods and colossal squids exhibit "deep-sea gigantism"?',
    options: ['Abundant sugary food on the bottom', 'Lower temperatures, high pressure, and reduced predation favoring larger cell sizes and metabolic efficiency', 'Radiation from underwater volcanoes', 'Frequent genetic mutation caused by darkness'],
    answer: 1,
    explanation: 'Deep-sea gigantism (Bergmann and Kleiber physiological principles) is favored by cold water and scarce, episodic food resources, where large body sizes maximize starvation resistance and endurance.'
  },
  {
    id: 'q13',
    category: 'Marine Ecology',
    question: 'Why are coral reefs often referred to as the "rainforests of the sea"?',
    options: ['They receive intense rainfall', 'They occupy less than 1% of the ocean floor but support over 25% of all marine species', 'They are formed by freshwater trees', 'They only exist in humid rainforest estuaries'],
    answer: 1,
    explanation: 'Despite covering less than 0.1% of the ocean surface, coral reefs harbor more than 25% of all documented marine life, representing the highest biodiversity density on the planet.'
  },
  {
    id: 'q14',
    category: 'Ocean Physics',
    question: 'What causes the Great Ocean Conveyor Belt (thermohaline circulation)?',
    options: ['Whale migration patterns and dolphin pods', 'Differences in water density driven by water temperature and salinity', 'Moon gravity alone', 'Underwater tectonic earthquakes'],
    answer: 1,
    explanation: 'Thermohaline circulation is driven by differences in seawater density: cold, salty water sinks in polar regions and slowly circulates across global ocean basins over a 1,000-year cycle.'
  },
  {
    id: 'q15',
    category: 'Deep Sea Adaptations',
    question: 'Why do most deep-sea anglerfish lack gas swim bladders?',
    options: ['They forgot how to swim', 'Gases compress or expand catastrophically under extreme pressure, so they use lipid and cartilage buoyancy instead', 'They must constantly rest on rocks', 'Gas bladders glow and give away their position'],
    answer: 1,
    explanation: 'Under hundreds of atmospheres of hydrostatic pressure, maintaining a gas-filled swim bladder is energetically unsustainable and dangerous during vertical movement; deep fish rely on water-dense gelatinous tissues.'
  }
]

// ── EXPEDITION BADGES & MILESTONES ────────────────────
export const expeditionBadges = [
  {
    id: 'first-contact',
    title: 'First Contact',
    description: 'Mark your very first documented marine species discovery.',
    icon: '🌟'
  },
  {
    id: 'sunlight-diver',
    title: 'Sunlight Explorer',
    description: 'Discover 3 or more species in the sunlit Epipelagic zone.',
    icon: '☀'
  },
  {
    id: 'twilight-scout',
    title: 'Twilight Specialist',
    description: 'Catalog 3 or more mysterious creatures from the Mesopelagic zone.',
    icon: '◐'
  },
  {
    id: 'abyssal-pioneer',
    title: 'Abyssal Pioneer',
    description: 'Explore the deepest abyss or hadal trenches (4,000m+).',
    icon: '✦'
  },
  {
    id: 'creature-architect',
    title: 'Bio-Architect',
    description: 'Synthesize a hypothetical creature concept in The Unknown.',
    icon: '🧬'
  },
  {
    id: 'master-curator',
    title: 'Field Naturalist',
    description: 'Save 4 or more favorite species to your personal journal.',
    icon: '⭐'
  },
  {
    id: 'ocean-scholar',
    title: 'Deep Sea Scholar',
    description: 'Score 80% or higher on the expedition knowledge quiz.',
    icon: '🎓'
  }
]