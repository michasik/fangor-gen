import type { GenerationParams } from '~/types/generation'
import { createPrng } from '~/utils/prng'
import { hexToRgba, rgbaString } from '~/utils/color'

interface RingSpec {
  outerRadius: number
  innerRadius: number
  color: string
}

export function useCanvasRenderer() {
  function computeRings(params: GenerationParams): RingSpec[] {
    const rng = createPrng(params.seed)
    const { ringCount, colors } = params
    const widthVariance = 0.3

    const maxRadius = 0.48
    const rings: RingSpec[] = []

    // Distribute rings from outer to inner
    const baseWidth = maxRadius / ringCount

    let currentOuter = maxRadius
    for (let i = 0; i < ringCount; i++) {
      const variance = 1 + (rng() * 2 - 1) * widthVariance
      const width = baseWidth * variance
      const innerRadius = Math.max(currentOuter - width, 0)
      const color = colors[i % colors.length]

      rings.push({
        outerRadius: currentOuter,
        innerRadius,
        color,
      })

      currentOuter = innerRadius
      if (currentOuter <= 0) break
    }

    return rings
  }

  function render(canvas: HTMLCanvasElement, params: GenerationParams) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const centerX = w * 0.5
    const centerY = h * 0.5
    const scale = Math.min(w, h)

    // Fill background
    ctx.fillStyle = params.backgroundColor
    ctx.fillRect(0, 0, w, h)

    const rings = computeRings(params)
    const blur = params.blurIntensity

    // Draw each ring outermost → innermost
    for (const ring of rings) {
      const outerPx = ring.outerRadius * scale
      const innerPx = ring.innerRadius * scale

      if (outerPx <= 0) continue

      const { r, g, b } = hexToRgba(ring.color, 1)
      const solid = rgbaString(r, g, b, 1)
      const transparent = rgbaString(r, g, b, 0)

      const gradient = ctx.createRadialGradient(
        centerX, centerY, innerPx,
        centerX, centerY, outerPx,
      )

      // Sfumato: gradient from transparent → solid → solid → transparent
      // blurIntensity controls how much of the ring is gradient vs solid
      const sfumatoSpread = blur * 0.4

      gradient.addColorStop(0, transparent)
      gradient.addColorStop(Math.min(sfumatoSpread, 0.49), solid)
      gradient.addColorStop(Math.max(1 - sfumatoSpread, 0.51), solid)
      gradient.addColorStop(1, transparent)

      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerPx, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }
  }

  return { computeRings, render }
}
