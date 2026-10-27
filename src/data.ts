import type { Creature } from './types'

export const creatures: Creature[] = [
  {
    id: 'turtle', name: 'Green sea turtle', scientific: 'Chelonia mydas', zone: 'Sunlight zone',
    type: 'Reptile', diet: 'Herbivore', depth: '0–200 m', status: 'Endangered',
    description: 'A graceful ocean traveller that migrates long distances between feeding grounds and nesting beaches. Seagrass meadows are an important part of its adult diet.',
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1000&q=85',
    fact: 'Some green sea turtles travel thousands of kilometres to return to their nesting beaches.'
  },
  {
    id: 'clownfish', name: 'Clownfish', scientific: 'Amphiprioninae', zone: 'Sunlight zone',
    type: 'Fish', diet: 'Omnivore', depth: '1–15 m', status: 'Least concern',
    description: 'Small reef fish known for their partnership with sea anemones. A mucus layer helps protect them from the anemone’s stinging cells.',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1000&q=85',
    fact: 'In many clownfish groups, the largest individual is the breeding female.'
  },
  {
    id: 'dolphin', name: 'Bottlenose dolphin', scientific: 'Tursiops truncatus', zone: 'Sunlight zone',
    type: 'Mammal', diet: 'Carnivore', depth: 'Surface–300 m', status: 'Least concern',
    description: 'Highly social marine mammals that use sound to communicate and echolocation to locate prey in changing underwater conditions.',
    image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=1000&q=85',
    fact: 'Dolphins use echolocation clicks to help detect objects and prey underwater.'
  },
  {
    id: 'manta', name: 'Giant manta ray', scientific: 'Mobula birostris', zone: 'Sunlight zone',
    type: 'Ray', diet: 'Filter feeder', depth: '0–1,000 m', status: 'Endangered',
    description: 'A gentle giant that glides through the water with enormous wing-like pectoral fins, filtering tiny plankton from the sea.',
    image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
    fact: 'Giant manta rays can have wingspans of more than six metres.'
  },
  {
    id: 'jellyfish', name: 'Moon jellyfish', scientific: 'Aurelia aurita', zone: 'Twilight zone',
    type: 'Cnidarian', diet: 'Carnivore', depth: '0–400 m', status: 'Not evaluated',
    description: 'A translucent drifter with four distinctive horseshoe-shaped structures visible through its bell. It moves with gentle pulses and ocean currents.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    fact: 'Moon jellyfish are mostly water and drift with currents rather than swimming long distances.'
  },
  {
    id: 'octopus', name: 'Common octopus', scientific: 'Octopus vulgaris', zone: 'Twilight zone',
    type: 'Cephalopod', diet: 'Carnivore', depth: '0–200 m', status: 'Least concern',
    description: 'An intelligent invertebrate with eight arms, remarkable camouflage, and the ability to squeeze through surprisingly small spaces.',
    image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1000&q=85',
    fact: 'Octopuses have specialised pigment cells that help them rapidly change colour.'
  },
  {
    id: 'whale', name: 'Humpback whale', scientific: 'Megaptera novaeangliae', zone: 'Twilight zone',
    type: 'Mammal', diet: 'Filter feeder', depth: 'Surface–200 m', status: 'Least concern',
    description: 'Known for haunting songs and spectacular migrations, humpback whales feed on small fish and krill, often using coordinated bubble nets.',
    image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
    fact: 'Some humpback whale populations migrate thousands of kilometres each year.'
  },
  {
    id: 'anglerfish', name: 'Anglerfish', scientific: 'Lophiiformes', zone: 'Midnight zone',
    type: 'Fish', diet: 'Carnivore', depth: '200–2,000+ m', status: 'Varies by species',
    description: 'A deep-sea fish group adapted to dark habitats. Some species have a lure that helps attract prey in the darkness.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',
    fact: 'Only some anglerfish species use a bioluminescent lure to attract prey.'
  },
  {
    id: 'shark', name: 'Whale shark', scientific: 'Rhincodon typus', zone: 'Sunlight zone',
    type: 'Fish', diet: 'Filter feeder', depth: 'Surface–1,000+ m', status: 'Endangered',
    description: 'The largest known fish, identified by its broad head and pattern of pale spots. Despite its size, it feeds mainly on plankton and small organisms.',
    image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1000&q=85',
    fact: 'Whale sharks are filter feeders and are not active hunters of large prey.'
  },
]

export const zones = [
  { name: 'Sunlight zone', depth: '0–200 m', note: 'Where sunlight fuels vibrant reef life.', image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=85', icon: '☀' },
  { name: 'Twilight zone', depth: '200–1,000 m', note: 'A dim world of drifting silhouettes.', image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1200&q=85', icon: '◐' },
  { name: 'Midnight zone', depth: '1,000 m+', note: 'Cold darkness and extraordinary adaptations.', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=85', icon: '☾' },
] as const

export const quizQuestions = [
  { question: 'Which ocean animal is the largest known fish?', options: ['Great white shark', 'Whale shark', 'Blue whale', 'Giant manta ray'], answer: 1, explanation: 'The whale shark is the largest fish. The blue whale is larger overall, but it is a mammal.' },
  { question: 'What is bioluminescence?', options: ['Light produced by living organisms', 'Reflection from the moon', 'Heat released by coral', 'A type of ocean current'], answer: 0, explanation: 'Bioluminescence is light generated by a chemical reaction inside a living organism.' },
  { question: 'Which zone receives the most sunlight?', options: ['Midnight zone', 'Abyssal zone', 'Sunlight zone', 'Twilight zone'], answer: 2, explanation: 'The sunlight zone is the upper ocean layer where enough light penetrates for photosynthesis.' },
  { question: 'What do many coral reef ecosystems depend on?', options: ['Freshwater rivers', 'Healthy water and symbiotic algae', 'No sunlight at all', 'Constant freezing temperatures'], answer: 1, explanation: 'Many reef-building corals rely on symbiotic algae and are sensitive to changes in water conditions.' },
  { question: 'How do dolphins find objects in murky water?', options: ['Infrared vision', 'Echolocation', 'Electric wings', 'Magnetic bubbles'], answer: 1, explanation: 'Dolphins emit sounds and listen for returning echoes to help locate objects and prey.' },
]