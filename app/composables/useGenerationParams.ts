import { ref } from 'vue'
import { DEFAULT_PARAMS, PARAM_LIMITS, type GenerationParams } from '~/types/generation'
import { createPrng } from '~/utils/prng'
import { generateSeed } from '~/utils/prng'
import { randomHexColor } from '~/utils/color'

const params = ref<GenerationParams>(structuredClone(DEFAULT_PARAMS))

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

  function randomizeAll() {
    const seed = generateSeed()
    const rng = createPrng(seed)

    const { ringCount: rc, blurIntensity: bi } = PARAM_LIMITS
    const ringCount = Math.floor(rng() * (rc.max - rc.min + 1)) + rc.min
    const blurIntensity = Math.round((rng() * (bi.max - bi.min) + bi.min) * 100) / 100
    const colorCount = Math.floor(rng() * (PARAM_LIMITS.colorCount.max - PARAM_LIMITS.colorCount.min + 1)) + PARAM_LIMITS.colorCount.min

    const colors: string[] = []
    for (let i = 0; i < colorCount; i++) {
      colors.push(randomHexColor(rng))
    }

    params.value = {
      seed,
      ringCount,
      blurIntensity,
      colors,
      backgroundColor: randomHexColor(rng),
    }
  }

  function applySeed(seed: string) {
    const rng = createPrng(seed)

    const { ringCount: rc, blurIntensity: bi } = PARAM_LIMITS
    const ringCount = Math.floor(rng() * (rc.max - rc.min + 1)) + rc.min
    const blurIntensity = Math.round((rng() * (bi.max - bi.min) + bi.min) * 100) / 100
    const colorCount = Math.floor(rng() * (PARAM_LIMITS.colorCount.max - PARAM_LIMITS.colorCount.min + 1)) + PARAM_LIMITS.colorCount.min

    const colors: string[] = []
    for (let i = 0; i < colorCount; i++) {
      colors.push(randomHexColor(rng))
    }

    params.value = {
      seed,
      ringCount,
      blurIntensity,
      colors,
      backgroundColor: randomHexColor(rng),
    }
  }

  return {
    params,
    setColor,
    setBackgroundColor,
    setColorCount,
    setParam,
    randomizeAll,
    applySeed,
  }
}
