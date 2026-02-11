<script setup lang="ts">
import { PARAM_LIMITS } from '~/types/generation'

const { params, randomizeAll } = useGenerationParams()
</script>

<template>
  <aside class="w-72 shrink-0 bg-neutral-900 border-r border-neutral-700 p-4 flex flex-col gap-5 overflow-y-auto">
    <h2 class="text-lg font-semibold text-neutral-100">Controls</h2>

    <GeneratorSeedControl />

    <GeneratorParameterSlider
      v-model="params.ringCount"
      label="Ring Count"
      :min="PARAM_LIMITS.ringCount.min"
      :max="PARAM_LIMITS.ringCount.max"
      :step="PARAM_LIMITS.ringCount.step"
    />

    <GeneratorParameterSlider
      v-model="params.blurIntensity"
      label="Blur Intensity"
      :min="PARAM_LIMITS.blurIntensity.min"
      :max="PARAM_LIMITS.blurIntensity.max"
      :step="PARAM_LIMITS.blurIntensity.step"
      :display-multiplier="100"
      unit="%"
    />

    <GeneratorColorPaletteControl />

    <button
      class="mt-auto px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
      @click="randomizeAll"
    >
      Randomize All
    </button>
  </aside>
</template>
