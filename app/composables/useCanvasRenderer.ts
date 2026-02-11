import type { GenerationParams } from '~/types/generation'
import { hexToRgba, rgbaString } from '~/utils/color'

export function useCanvasRenderer() {
  function render(canvas: HTMLCanvasElement, params: GenerationParams) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const centerX = w * (0.5 + params.centerX)
    const centerY = h * (0.5 + params.centerY)
    const maxRadius = Math.min(w, h) / 2

    // Fill background
    ctx.fillStyle = params.backgroundColor
    ctx.fillRect(0, 0, w, h)

    // Sort rings by diameter descending (painter's algorithm: outermost first)
    const sorted = [...params.rings].sort((a, b) => b.diameter - a.diameter)

    for (const ring of sorted) {
      const outerPx = (ring.diameter / 100) * maxRadius
      const innerPx = Math.max(outerPx - ring.width * maxRadius, 0)

      if (outerPx <= 0) continue

      const { r, g, b } = hexToRgba(ring.color, 1)
      const solid = rgbaString(r, g, b, 1)
      const transparent = rgbaString(r, g, b, 0)

      const gradient = ctx.createRadialGradient(
        centerX, centerY, innerPx,
        centerX, centerY, outerPx,
      )

      // Per-ring sfumato: inner edge blur and outer edge blur
      const innerSpread = ring.innerBlur * 0.4
      const outerSpread = ring.outerBlur * 0.4

      gradient.addColorStop(0, transparent)
      gradient.addColorStop(Math.min(innerSpread, 0.49), solid)
      gradient.addColorStop(Math.max(1 - outerSpread, 0.51), solid)
      gradient.addColorStop(1, transparent)

      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerPx, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }
  }

  return { render }
}
