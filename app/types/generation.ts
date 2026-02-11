export type AspectRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16'
export type CanvasSize = 'small' | 'medium' | 'large'

export const ASPECT_RATIO_MAP: Record<AspectRatio, { w: number; h: number }> = {
  '1:1': { w: 1, h: 1 },
  '4:3': { w: 4, h: 3 },
  '3:4': { w: 3, h: 4 },
  '16:9': { w: 16, h: 9 },
  '9:16': { w: 9, h: 16 },
}

export const CANVAS_SIZE_MAP: Record<CanvasSize, number> = {
  small: 1024,
  medium: 2048,
  large: 4096,
}

export interface GenerationParams {
  seed: string
  ringCount: number
  blurIntensity: number
  colors: string[]
  backgroundColor: string
  centerX: number
  centerY: number
  ringWidthVariance: number
  aspectRatio: AspectRatio
  canvasSize: CanvasSize
}

export const PARAM_LIMITS = {
  ringCount: { min: 3, max: 30, step: 1 },
  blurIntensity: { min: 0, max: 1, step: 0.01 },
  colorCount: { min: 2, max: 6, step: 1 },
  centerX: { min: -0.5, max: 0.5, step: 0.01 },
  centerY: { min: -0.5, max: 0.5, step: 0.01 },
  ringWidthVariance: { min: 0, max: 1, step: 0.01 },
} as const

export const DEFAULT_PARAMS: GenerationParams = {
  seed: 'fangor-001',
  ringCount: 12,
  blurIntensity: 0.5,
  colors: ['#FF6B35', '#004E89', '#F5E663'],
  backgroundColor: '#1A1A2E',
  centerX: 0,
  centerY: 0,
  ringWidthVariance: 0.3,
  aspectRatio: '1:1',
  canvasSize: 'medium',
}

export function getCanvasDimensions(aspectRatio: AspectRatio, canvasSize: CanvasSize): { width: number; height: number } {
  const maxPx = CANVAS_SIZE_MAP[canvasSize]
  const { w, h } = ASPECT_RATIO_MAP[aspectRatio]
  if (w >= h) {
    return { width: maxPx, height: Math.round(maxPx * (h / w)) }
  }
  return { width: Math.round(maxPx * (w / h)), height: maxPx }
}
