<script setup lang="ts">
import { PARAM_LIMITS } from '~/types/generation'

const { params, randomizeAll, randomizeParam } = useGenerationParams()

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
  <div class="flex flex-col gap-5">
    <GeneratorSeedControl />

    <!-- Composition -->
    <div class="flex flex-col gap-3">
      <h3 class="text-xs font-medium uppercase tracking-wider text-neutral-500">Composition</h3>

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
    </div>

    <!-- Canvas -->
    <div class="flex flex-col gap-3">
      <h3 class="text-xs font-medium uppercase tracking-wider text-neutral-500">Canvas</h3>

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
    </div>

    <!-- Colors -->
    <div class="flex flex-col gap-3">
      <h3 class="text-xs font-medium uppercase tracking-wider text-neutral-500">Colors</h3>
      <GeneratorPalettePresets />
      <GeneratorColorPaletteControl />
    </div>

    <button
      class="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
      @click="randomizeAll"
    >
      Randomize All
    </button>
  </div>
</template>
