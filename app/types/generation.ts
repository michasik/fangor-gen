import type { Prng } from '~/utils/prng'
import { randomHexColor } from '~/utils/color'

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

export interface RingConfig {
  color: string       // hex
  width: number       // band thickness as fraction of canvas radius (0.01–1.0)
  diameter: number    // outer edge position, 0–100 (% of canvas radius)
  innerBlur: number   // sfumato at inner edge (0–1)
  outerBlur: number   // sfumato at outer edge (0–1)
}

export interface GenerationParams {
  seed: string
  blurIntensity: number
  rings: RingConfig[]
  backgroundColor: string
  centerX: number
  centerY: number
  aspectRatio: AspectRatio
  canvasSize: CanvasSize
}

export const PARAM_LIMITS = {
  ringCount: { min: 1, max: 6, step: 1 },
  blurIntensity: { min: 0, max: 1, step: 0.01 },
  centerX: { min: -0.5, max: 0.5, step: 0.01 },
  centerY: { min: -0.5, max: 0.5, step: 0.01 },
  ringWidth: { min: 0.01, max: 1, step: 0.01 },
  ringDiameter: { min: 0, max: 100, step: 1 },
  ringBlur: { min: 0, max: 1, step: 0.01 },
} as const

export function createDefaultRing(rng: Prng, defaultBlur: number, diameter?: number): RingConfig {
  return {
    color: randomHexColor(rng),
    width: 0.16,
    diameter: diameter ?? 50,
    innerBlur: defaultBlur,
    outerBlur: defaultBlur,
  }
}

export const DEFAULT_PARAMS: GenerationParams = {
  seed: 'fangor-001',
  blurIntensity: 0.5,
  rings: [
    { color: '#FF6B35', width: 0.16, diameter: 100, innerBlur: 0.5, outerBlur: 0.5 },
    { color: '#004E89', width: 0.16, diameter: 66, innerBlur: 0.5, outerBlur: 0.5 },
    { color: '#F5E663', width: 0.16, diameter: 33, innerBlur: 0.5, outerBlur: 0.5 },
  ],
  backgroundColor: '#1A1A2E',
  centerX: 0,
  centerY: 0,
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
