import seedrandom from 'seedrandom'

export type Prng = () => number

export function createPrng(seed: string): Prng {
  return seedrandom(seed)
}

export function generateSeed(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
