export type TagReward = { type: 'money'; amount: number } | { type: 'free_reroll'; count: number }

export interface Tag {
  id: string
  name: string
  description: string
  reward: TagReward
}

export const TAGS: Tag[] = [
  { id: 'economy', name: 'Economy Tag', description: '+$5', reward: { type: 'money', amount: 5 } },
  { id: 'handy', name: 'Handy Tag', description: '+$8', reward: { type: 'money', amount: 8 } },
  {
    id: 'speed',
    name: 'Speed Tag',
    description: 'Free reroll in next shop',
    reward: { type: 'free_reroll', count: 1 },
  },
  { id: 'investment', name: 'Investment Tag', description: '+$10', reward: { type: 'money', amount: 10 } },
]
