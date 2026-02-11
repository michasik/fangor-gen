<script setup lang="ts">
const model = defineModel<number>({ required: true })

const props = withDefaults(defineProps<{
  label: string
  min: number
  max: number
  step: number
  displayMultiplier?: number
  unit?: string
}>(), {
  displayMultiplier: 1,
  unit: '',
})

const displayValue = computed(() => {
  const val = model.value * props.displayMultiplier
  return Number.isInteger(val) ? val.toString() : val.toFixed(2)
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <label class="text-sm text-neutral-300">{{ label }}</label>
        <slot name="action" />
      </div>
      <span class="text-xs font-mono text-neutral-400">{{ displayValue }}{{ unit }}</span>
    </div>
    <input
      v-model.number="model"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="w-full accent-indigo-500"
    >
  </div>
</template>
