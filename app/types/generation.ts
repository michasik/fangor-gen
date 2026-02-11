export interface GenerationParams {
  seed: string
  ringCount: number
  blurIntensity: number
  colors: string[]
  backgroundColor: string
}

export const PARAM_LIMITS = {
  ringCount: { min: 3, max: 30, step: 1 },
  blurIntensity: { min: 0, max: 1, step: 0.01 },
  colorCount: { min: 2, max: 6, step: 1 },
} as const

export const DEFAULT_PARAMS: GenerationParams = {
  seed: 'fangor-001',
  ringCount: 12,
  blurIntensity: 0.5,
  colors: ['#FF6B35', '#004E89', '#F5E663'],
  backgroundColor: '#1A1A2E',
}
