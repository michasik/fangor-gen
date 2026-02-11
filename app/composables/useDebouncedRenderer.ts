import { watch, ref, type Ref, onMounted, nextTick } from 'vue'
import { useGenerationParams } from './useGenerationParams'
import { useCanvasRenderer } from './useCanvasRenderer'

export function useDebouncedRenderer(canvasRef: Ref<HTMLCanvasElement | null>) {
  const { params } = useGenerationParams()
  const { render } = useCanvasRenderer()
  const isRendering = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let rafId: number | null = null

  function scheduleRender() {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (rafId) cancelAnimationFrame(rafId)

    isRendering.value = true

    debounceTimer = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        const canvas = canvasRef.value
        if (canvas) {
          render(canvas, params.value)
        }
        isRendering.value = false
        rafId = null
      })
      debounceTimer = null
    }, 150)
  }

  watch(
    () => params.value,
    () => scheduleRender(),
    { deep: true },
  )

  onMounted(async () => {
    await nextTick()
    const canvas = canvasRef.value
    if (canvas) {
      render(canvas, params.value)
    }
  })

  return { isRendering }
}
