export type Zone = 'All zones' | 'Sunlight zone' | 'Twilight zone' | 'Midnight zone'
export type Creature = {
  id: string
  name: string
  scientific: string
  zone: Exclude<Zone, 'All zones'>
  type: string
  diet: string
  depth: string
  status: string
  description: string
  image: string
  fact: string
}