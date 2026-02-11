<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { isRendering } = useDebouncedRenderer(canvasRef)
</script>

<template>
  <div class="relative flex items-center justify-center flex-1 bg-neutral-950 overflow-hidden">
    <canvas
      ref="canvasRef"
      width="800"
      height="800"
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
