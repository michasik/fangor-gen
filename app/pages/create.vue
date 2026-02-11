<script setup lang="ts">
import { PARAM_LIMITS } from '~/types/generation'

const { mode } = useBreakpoint()
const { params, randomizeAll, randomizeParam } = useGenerationParams()

const drawerOpen = ref(false)

const aspectRatioOptions = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:3', label: '4:3 (Landscape)' },
  { value: '3:4', label: '3:4 (Portrait)' },
  { value: '16:9', label: '16:9 (Wide)' },
  { value: '9:16', label: '9:16 (Tall)' },
]

const canvasSizeOptions = [
  { value: 'small', label: 'Small (1024px)' },
  { value: 'medium', label: 'Medium (2048px)' },
  { value: 'large', label: 'Large (4096px)' },
]
</script>

<template>
  <!-- Desktop: side-by-side -->
  <div v-if="mode === 'desktop'" class="h-screen flex bg-neutral-950">
    <GeneratorControlsPanel />
    <GeneratorCanvasPreview />
  </div>

  <!-- Tablet: full-width canvas + drawer -->
  <div v-else-if="mode === 'tablet'" class="h-screen flex flex-col bg-neutral-950">
    <div class="flex items-center justify-between px-4 py-2 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700">
      <h1 class="text-sm font-semibold text-neutral-100">fangorGen</h1>
      <button
        class="p-2 rounded text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700 transition-colors"
        @click="drawerOpen = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
    <GeneratorCanvasPreview />
    <GeneratorControlsDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </div>

  <!-- Mobile: stacked -->
  <div v-else class="min-h-screen flex flex-col bg-neutral-950">
    <div class="flex items-center justify-between px-4 py-2 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700">
      <h1 class="text-sm font-semibold text-neutral-100">fangorGen</h1>
    </div>

    <div class="flex items-center justify-center bg-neutral-950 max-h-[50vh] overflow-hidden">
      <GeneratorCanvasPreview />
    </div>

    <div class="flex flex-col gap-2 p-3">
      <GeneratorControlsAccordion title="Seed">
        <GeneratorSeedControl />
      </GeneratorControlsAccordion>

      <GeneratorControlsAccordion title="Composition">
        <GeneratorParameterSlider
          v-model="params.ringCount"
          label="Ring Count"
          :min="PARAM_LIMITS.ringCount.min"
          :max="PARAM_LIMITS.ringCount.max"
          :step="PARAM_LIMITS.ringCount.step"
        >
          <template #action>
            <GeneratorRandomizeButton @randomize="randomizeParam('ringCount')" />
          </template>
        </GeneratorParameterSlider>

        <GeneratorParameterSlider
          v-model="params.blurIntensity"
          label="Blur Intensity"
          :min="PARAM_LIMITS.blurIntensity.min"
          :max="PARAM_LIMITS.blurIntensity.max"
          :step="PARAM_LIMITS.blurIntensity.step"
          :display-multiplier="100"
          unit="%"
        >
          <template #action>
            <GeneratorRandomizeButton @randomize="randomizeParam('blurIntensity')" />
          </template>
        </GeneratorParameterSlider>

        <GeneratorParameterSlider
          v-model="params.centerX"
          label="Center X"
          :min="PARAM_LIMITS.centerX.min"
          :max="PARAM_LIMITS.centerX.max"
          :step="PARAM_LIMITS.centerX.step"
        >
          <template #action>
            <GeneratorRandomizeButton @randomize="randomizeParam('centerX')" />
          </template>
        </GeneratorParameterSlider>

        <GeneratorParameterSlider
          v-model="params.centerY"
          label="Center Y"
          :min="PARAM_LIMITS.centerY.min"
          :max="PARAM_LIMITS.centerY.max"
          :step="PARAM_LIMITS.centerY.step"
        >
          <template #action>
            <GeneratorRandomizeButton @randomize="randomizeParam('centerY')" />
          </template>
        </GeneratorParameterSlider>

        <GeneratorParameterSlider
          v-model="params.ringWidthVariance"
          label="Ring Width Variance"
          :min="PARAM_LIMITS.ringWidthVariance.min"
          :max="PARAM_LIMITS.ringWidthVariance.max"
          :step="PARAM_LIMITS.ringWidthVariance.step"
          :display-multiplier="100"
          unit="%"
        >
          <template #action>
            <GeneratorRandomizeButton @randomize="randomizeParam('ringWidthVariance')" />
          </template>
        </GeneratorParameterSlider>
      </GeneratorControlsAccordion>

      <GeneratorControlsAccordion title="Canvas">
        <GeneratorParameterSelect
          v-model="params.aspectRatio"
          label="Aspect Ratio"
          :options="aspectRatioOptions"
        />
        <GeneratorParameterSelect
          v-model="params.canvasSize"
          label="Canvas Size"
          :options="canvasSizeOptions"
        />
      </GeneratorControlsAccordion>

      <GeneratorControlsAccordion title="Colors">
        <GeneratorPalettePresets />
        <GeneratorColorPaletteControl />
      </GeneratorControlsAccordion>

      <button
        class="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors mb-4"
        @click="randomizeAll"
      >
        Randomize All
      </button>
    </div>
  </div>
</template>
