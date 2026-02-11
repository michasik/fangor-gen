import { ref } from 'vue'
import { DEFAULT_PARAMS, PARAM_LIMITS, type GenerationParams } from '~/types/generation'
import { createPrng, generateSeed } from '~/utils/prng'
import { randomHexColor } from '~/utils/color'

const params = ref<GenerationParams>(structuredClone(DEFAULT_PARAMS))

function generateArtisticParams(rng: () => number) {
  const { ringCount: rc, blurIntensity: bi, centerX: cx, centerY: cy, ringWidthVariance: rwv } = PARAM_LIMITS
  const ringCount = Math.floor(rng() * (rc.max - rc.min + 1)) + rc.min
  const blurIntensity = Math.round((rng() * (bi.max - bi.min) + bi.min) * 100) / 100
  const centerX = Math.round((rng() * (cx.max - cx.min) + cx.min) * 100) / 100
  const centerY = Math.round((rng() * (cy.max - cy.min) + cy.min) * 100) / 100
  const ringWidthVariance = Math.round((rng() * (rwv.max - rwv.min) + rwv.min) * 100) / 100
  const colorCount = Math.floor(rng() * (PARAM_LIMITS.colorCount.max - PARAM_LIMITS.colorCount.min + 1)) + PARAM_LIMITS.colorCount.min

  const colors: string[] = []
  for (let i = 0; i < colorCount; i++) {
    colors.push(randomHexColor(rng))
  }

  return { ringCount, blurIntensity, centerX, centerY, ringWidthVariance, colors, backgroundColor: randomHexColor(rng) }
}

export function useGenerationParams() {
  function setColor(index: number, hex: string) {
    if (index >= 0 && index < params.value.colors.length) {
      params.value.colors[index] = hex
    }
  }

  function setBackgroundColor(hex: string) {
    params.value.backgroundColor = hex
  }

  function setColorCount(count: number) {
    const clamped = Math.min(Math.max(count, PARAM_LIMITS.colorCount.min), PARAM_LIMITS.colorCount.max)
    const current = params.value.colors

    if (clamped > current.length) {
      const rng = createPrng(params.value.seed + current.length)
      const newColors = [...current]
      while (newColors.length < clamped) {
        newColors.push(randomHexColor(rng))
      }
      params.value.colors = newColors
    } else if (clamped < current.length) {
      params.value.colors = current.slice(0, clamped)
    }
  }

  function setParam<K extends keyof GenerationParams>(key: K, value: GenerationParams[K]) {
    params.value[key] = value
  }

  function randomizeParam(key: 'ringCount' | 'blurIntensity' | 'centerX' | 'centerY' | 'ringWidthVariance') {
    const limits = PARAM_LIMITS[key]
    const rng = createPrng(generateSeed())
    const raw = rng() * (limits.max - limits.min) + limits.min
    if (limits.step >= 1) {
      params.value[key] = Math.floor(raw)
    } else {
      params.value[key] = Math.round(raw * 100) / 100
    }
  }

  function reorderColors(fromIndex: number, toIndex: number) {
    const colors = [...params.value.colors]
    const [moved] = colors.splice(fromIndex, 1)
    colors.splice(toIndex, 0, moved!)
    params.value.colors = colors
  }

  function applyPalette(colors: string[], backgroundColor: string) {
    params.value.colors = [...colors]
    params.value.backgroundColor = backgroundColor
  }

  function randomizeAll() {
    const seed = generateSeed()
    const rng = createPrng(seed)
    const artistic = generateArtisticParams(rng)

    params.value = {
      ...artistic,
      seed,
      aspectRatio: params.value.aspectRatio,
      canvasSize: params.value.canvasSize,
    }
  }

  function applySeed(seed: string) {
    const rng = createPrng(seed)
    const artistic = generateArtisticParams(rng)

    params.value = {
      ...artistic,
      seed,
      aspectRatio: params.value.aspectRatio,
      canvasSize: params.value.canvasSize,
    }
  }

  return {
    params,
    setColor,
    setBackgroundColor,
    setColorCount,
    setParam,
    randomizeParam,
    reorderColors,
    applyPalette,
    randomizeAll,
    applySeed,
  }
}
