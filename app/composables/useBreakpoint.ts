import { ref, onMounted, onUnmounted } from 'vue'

export type BreakpointMode = 'desktop' | 'tablet' | 'mobile'

export function useBreakpoint() {
  const mode = ref<BreakpointMode>('desktop')

  let mqDesktop: MediaQueryList | null = null
  let mqTablet: MediaQueryList | null = null

  function update() {
    if (mqDesktop?.matches) {
      mode.value = 'desktop'
    } else if (mqTablet?.matches) {
      mode.value = 'tablet'
    } else {
      mode.value = 'mobile'
    }
  }

  onMounted(() => {
    mqDesktop = window.matchMedia('(min-width: 1024px)')
    mqTablet = window.matchMedia('(min-width: 768px)')
    update()
    mqDesktop.addEventListener('change', update)
    mqTablet.addEventListener('change', update)
  })

  onUnmounted(() => {
    mqDesktop?.removeEventListener('change', update)
    mqTablet?.removeEventListener('change', update)
  })

  return { mode }
}
