<script setup lang="ts">
import { ASPECT_RATIO_MAP } from '~/types/generation'

const { params } = useGenerationParams()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { isRendering } = useDebouncedRenderer(canvasRef)

const previewDimensions = computed(() => {
  const maxEdge = 800
  const { w, h } = ASPECT_RATIO_MAP[params.value.aspectRatio]
  if (w >= h) {
    return { width: maxEdge, height: Math.round(maxEdge * (h / w)) }
  }
  return { width: Math.round(maxEdge * (w / h)), height: maxEdge }
})

watch(previewDimensions, async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (canvas) {
    const { render } = useCanvasRenderer()
    render(canvas, params.value)
  }
})
</script>

<template>
  <div class="relative flex items-center justify-center flex-1 bg-neutral-950 overflow-hidden">
    <canvas
      ref="canvasRef"
      :width="previewDimensions.width"
      :height="previewDimensions.height"
      class="max-w-full max-h-full"
    />
    <div
      v-if="isRendering"
      class="absolute top-3 right-3 px-2 py-1 text-xs bg-neutral-800/80 text-neutral-400 rounded"
    >
      Rendering...
    </div>
  </div>
</template>
