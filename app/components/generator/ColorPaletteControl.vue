<script setup lang="ts">
import { PARAM_LIMITS } from '~/types/generation'
import { isValidHex, normalizeHex } from '~/utils/color'

const { params, setColor, setColorCount, setBackgroundColor } = useGenerationParams()

const editingHex = ref<Record<number, string>>({})

function onHexInput(index: number, value: string) {
  editingHex.value[index] = value
  if (isValidHex(value)) {
    setColor(index, normalizeHex(value))
  }
}

function onHexBlur(index: number) {
  // Reset to current value if invalid
  delete editingHex.value[index]
}

function onPickerChange(index: number, event: Event) {
  const value = (event.target as HTMLInputElement).value
  setColor(index, normalizeHex(value))
}

function onBgPickerChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  setBackgroundColor(normalizeHex(value))
}

function addColor() {
  setColorCount(params.value.colors.length + 1)
}

function removeColor() {
  setColorCount(params.value.colors.length - 1)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <label class="text-sm text-neutral-300">Colors ({{ params.colors.length }})</label>
      <div class="flex gap-1">
        <button
          :disabled="params.colors.length <= PARAM_LIMITS.colorCount.min"
          class="px-2 py-0.5 text-sm rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
          @click="removeColor"
        >
          -
        </button>
        <button
          :disabled="params.colors.length >= PARAM_LIMITS.colorCount.max"
          class="px-2 py-0.5 text-sm rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
          @click="addColor"
        >
          +
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="(color, i) in params.colors"
        :key="i"
        class="flex items-center gap-2"
      >
        <label class="relative w-8 h-8 rounded cursor-pointer overflow-hidden shrink-0 border border-neutral-600">
          <input
            type="color"
            :value="color"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            @input="onPickerChange(i, $event)"
          >
          <div class="w-full h-full" :style="{ backgroundColor: color }" />
        </label>
        <input
          :value="editingHex[i] ?? color"
          type="text"
          class="flex-1 px-2 py-1 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
          maxlength="7"
          @input="onHexInput(i, ($event.target as HTMLInputElement).value)"
          @blur="onHexBlur(i)"
        >
      </div>
    </div>

    <div class="flex items-center gap-2 pt-1 border-t border-neutral-700">
      <label class="relative w-8 h-8 rounded cursor-pointer overflow-hidden shrink-0 border border-neutral-600">
        <input
          type="color"
          :value="params.backgroundColor"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          @input="onBgPickerChange"
        >
        <div class="w-full h-full" :style="{ backgroundColor: params.backgroundColor }" />
      </label>
      <span class="text-xs text-neutral-400">Background</span>
      <span class="text-xs font-mono text-neutral-500 ml-auto">{{ params.backgroundColor }}</span>
    </div>
  </div>
</template>
