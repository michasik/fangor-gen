import { ref, watch } from 'vue'
import { DEFAULT_PARAMS, PARAM_LIMITS, createDefaultRing, type GenerationParams, type RingConfig } from '~/types/generation'
import { createPrng, generateSeed } from '~/utils/prng'
import { randomHexColor } from '~/utils/color'

const params = ref<GenerationParams>(structuredClone(DEFAULT_PARAMS))

function encodeParams(p: GenerationParams): string {
  const rings = p.rings.map(r =>
    `${r.color.slice(1)}_${r.width}_${r.diameter}_${r.innerBlur}_${r.outerBlur}`
  ).join('!')
  const parts = [
    `s=${encodeURIComponent(p.seed)}`,
    `b=${p.blurIntensity}`,
    `bg=${p.backgroundColor.slice(1)}`,
    `cx=${p.centerX}`,
    `cy=${p.centerY}`,
    `ar=${encodeURIComponent(p.aspectRatio)}`,
    `cs=${p.canvasSize}`,
    `r=${rings}`,
  ]
  return parts.join('&')
}

function decodeParams(query: string): GenerationParams | null {
  try {
    const u = new URLSearchParams(query)
    const seed = u.get('s')
    const ringsRaw = u.get('r')
    if (!seed || !ringsRaw) return null

    const rings: RingConfig[] = ringsRaw.split('!').map(chunk => {
      const [color, width, diameter, innerBlur, outerBlur] = chunk.split('_')
      return {
        color: `#${color}`,
        width: Number(width),
        diameter: Number(diameter),
        innerBlur: Number(innerBlur),
        outerBlur: Number(outerBlur),
      }
    })

    return {
      seed: decodeURIComponent(seed),
      blurIntensity: Number(u.get('b') ?? 0.5),
      backgroundColor: `#${u.get('bg') ?? '1A1A2E'}`,
      centerX: Number(u.get('cx') ?? 0),
      centerY: Number(u.get('cy') ?? 0),
      aspectRatio: (u.get('ar') ?? '1:1') as GenerationParams['aspectRatio'],
      canvasSize: (u.get('cs') ?? 'medium') as GenerationParams['canvasSize'],
      rings,
    }
  } catch {
    return null
  }
}

let skipUrlSync = false

function generateArtisticParams(rng: () => number) {
  const { blurIntensity: bi, centerX: cx, centerY: cy } = PARAM_LIMITS
  const blurIntensity = Math.round((rng() * (bi.max - bi.min) + bi.min) * 100) / 100
  const centerX = Math.round((rng() * (cx.max - cx.min) + cx.min) * 100) / 100
  const centerY = Math.round((rng() * (cy.max - cy.min) + cy.min) * 100) / 100

  const ringCount = Math.floor(rng() * (PARAM_LIMITS.ringCount.max - PARAM_LIMITS.ringCount.min + 1)) + PARAM_LIMITS.ringCount.min
  const rings: RingConfig[] = []

  for (let i = 0; i < ringCount; i++) {
    const baseDiameter = 100 - (i * (100 / ringCount))
    const variance = (rng() * 2 - 1) * (50 / ringCount)
    const diameter = Math.round(Math.min(100, Math.max(0, baseDiameter + variance)))
    const width = Math.round((0.05 + rng() * 0.25) * 100) / 100
    const innerBlur = Math.round((rng() * (bi.max - bi.min) + bi.min) * 100) / 100
    const outerBlur = Math.round((rng() * (bi.max - bi.min) + bi.min) * 100) / 100

    rings.push({
      color: randomHexColor(rng),
      width,
      diameter,
      innerBlur,
      outerBlur,
    })
  }

  return { rings, blurIntensity, centerX, centerY, backgroundColor: randomHexColor(rng) }
}

function initFromUrl() {
  if (import.meta.server) return
  const query = window.location.search.slice(1)
  if (!query) return
  const decoded = decodeParams(query)
  if (decoded) {
    skipUrlSync = true
    params.value = decoded
    skipUrlSync = false
  }
}

let urlSyncActive = false

export function useGenerationParams() {
  if (import.meta.client && !urlSyncActive) {
    urlSyncActive = true
    initFromUrl()
    watch(params, (p) => {
      if (skipUrlSync) return
      const qs = encodeParams(p)
      const newUrl = `${window.location.pathname}?${qs}`
      window.history.replaceState(null, '', newUrl)
    }, { deep: true })
  }
  function setRingProp<K extends keyof RingConfig>(index: number, key: K, value: RingConfig[K]) {
    if (index >= 0 && index < params.value.rings.length) {
      params.value.rings[index]![key] = value
    }
  }

  function addRing() {
    if (params.value.rings.length >= PARAM_LIMITS.ringCount.max) return
    const rng = createPrng(params.value.seed + params.value.rings.length)
    params.value.rings.push(createDefaultRing(rng, params.value.blurIntensity))
  }

  function removeRing(index: number) {
    if (params.value.rings.length <= PARAM_LIMITS.ringCount.min) return
    params.value.rings.splice(index, 1)
  }

  function reorderRings(fromIndex: number, toIndex: number) {
    const rings = [...params.value.rings]
    const [moved] = rings.splice(fromIndex, 1)
    rings.splice(toIndex, 0, moved!)
    params.value.rings = rings
  }

  function setBackgroundColor(hex: string) {
    params.value.backgroundColor = hex
  }

  function setParam<K extends keyof GenerationParams>(key: K, value: GenerationParams[K]) {
    params.value[key] = value
  }

  function randomizeParam(key: 'blurIntensity' | 'centerX' | 'centerY') {
    const limits = PARAM_LIMITS[key]
    const rng = createPrng(generateSeed())
    const raw = rng() * (limits.max - limits.min) + limits.min
    params.value[key] = Math.round(raw * 100) / 100
  }

  function applyPalette(colors: string[], backgroundColor: string) {
    const currentRings = params.value.rings
    const newRings: RingConfig[] = []

    for (let i = 0; i < colors.length; i++) {
      if (i < currentRings.length) {
        // Preserve geometry, update color
        newRings.push({ ...currentRings[i]!, color: colors[i]! })
      } else {
        // Create new ring with evenly spaced diameter
        const diameter = Math.round(100 - (i * (100 / colors.length)))
        newRings.push({
          color: colors[i]!,
          width: 0.16,
          diameter,
          innerBlur: params.value.blurIntensity,
          outerBlur: params.value.blurIntensity,
        })
      }
    }

    params.value.rings = newRings
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
    setRingProp,
    addRing,
    removeRing,
    reorderRings,
    setBackgroundColor,
    setParam,
    randomizeParam,
    applyPalette,
    randomizeAll,
    applySeed,
  }
}
