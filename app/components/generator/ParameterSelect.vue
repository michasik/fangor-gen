<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  label: string
  options: { value: string; label: string }[]
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm text-neutral-300">{{ label }}</label>
    <select
      v-model="model"
      class="w-full px-2 py-1.5 text-sm bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer select-dark"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
