<script setup lang="ts">
import { PARAM_LIMITS } from '~/types/generation'
import { isValidHex, normalizeHex, hexToRgba } from '~/utils/color'

const { params, setColor, setColorCount, setBackgroundColor, reorderColors } = useGenerationParams()

const editingHex = ref<Record<number, string>>({})
const colorMode = ref<Record<number, 'hex' | 'rgba'>>({})
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function getMode(index: number): 'hex' | 'rgba' {
  return colorMode.value[index] ?? 'hex'
}

function toggleMode(index: number) {
  colorMode.value[index] = getMode(index) === 'hex' ? 'rgba' : 'hex'
}

function getRgb(hex: string) {
  const { r, g, b } = hexToRgba(hex, 1)
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)))
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`.toUpperCase()
}

function onRgbChange(index: number, channel: 'r' | 'g' | 'b', value: string) {
  const num = parseInt(value, 10)
  if (isNaN(num)) return
  const current = getRgb(params.value.colors[index]!)
  current[channel] = num
  setColor(index, rgbToHex(current.r, current.g, current.b))
}

function onHexInput(index: number, value: string) {
  editingHex.value[index] = value
  if (isValidHex(value)) {
    setColor(index, normalizeHex(value))
  }
}

function onHexBlur(index: number) {
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

// Drag and drop
function onDragStart(index: number, event: DragEvent) {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index: number, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

function onDragLeave() {
  dragOverIndex.value = null
}

function onDrop(toIndex: number, event: DragEvent) {
  event.preventDefault()
  if (dragIndex.value !== null && dragIndex.value !== toIndex) {
    reorderColors(dragIndex.value, toIndex)
  }
  dragIndex.value = null
  dragOverIndex.value = null
}

function onDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <label class="text-sm text-neutral-300">Colors ({{ params.colors.length }})</label>
      <div class="flex gap-1">
        <button
          :disabled="params.colors.length <= PARAM_LIMITS.colorCount.min"
          class="px-2 py-0.5 text-sm rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="removeColor"
        >
          -
        </button>
        <button
          :disabled="params.colors.length >= PARAM_LIMITS.colorCount.max"
          class="px-2 py-0.5 text-sm rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
        class="flex items-center gap-2 rounded px-1 py-0.5 transition-colors"
        :class="{
          'opacity-50': dragIndex === i,
          'bg-indigo-500/20 border-indigo-500': dragOverIndex === i && dragIndex !== i,
        }"
        draggable="true"
        @dragstart="onDragStart(i, $event)"
        @dragover="onDragOver(i, $event)"
        @dragleave="onDragLeave"
        @drop="onDrop(i, $event)"
        @dragend="onDragEnd"
      >
        <!-- Grip handle -->
        <span class="cursor-grab text-neutral-600 hover:text-neutral-400 select-none shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="2" /><circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" /><circle cx="15" cy="12" r="2" />
            <circle cx="9" cy="18" r="2" /><circle cx="15" cy="18" r="2" />
          </svg>
        </span>

        <!-- Color swatch / picker -->
        <label class="relative w-8 h-8 rounded cursor-pointer overflow-hidden shrink-0 border border-neutral-600">
          <input
            type="color"
            :value="color"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            @input="onPickerChange(i, $event)"
          >
          <div class="w-full h-full" :style="{ backgroundColor: color }" />
        </label>

        <!-- Mode toggle -->
        <div class="flex flex-col gap-0.5 flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <button
              class="px-1.5 py-0.5 text-[10px] rounded transition-colors"
              :class="getMode(i) === 'hex' ? 'bg-neutral-600 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'"
              @click="toggleMode(i)"
            >
              HEX
            </button>
            <button
              class="px-1.5 py-0.5 text-[10px] rounded transition-colors"
              :class="getMode(i) === 'rgba' ? 'bg-neutral-600 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'"
              @click="toggleMode(i)"
            >
              RGB
            </button>
          </div>

          <!-- Hex input -->
          <input
            v-if="getMode(i) === 'hex'"
            :value="editingHex[i] ?? color"
            type="text"
            class="w-full px-2 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
            maxlength="7"
            @input="onHexInput(i, ($event.target as HTMLInputElement).value)"
            @blur="onHexBlur(i)"
          >

          <!-- RGB inputs -->
          <div v-else class="flex gap-1">
            <input
              :value="getRgb(color).r"
              type="number"
              min="0"
              max="255"
              class="w-full px-1 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
              @input="onRgbChange(i, 'r', ($event.target as HTMLInputElement).value)"
            >
            <input
              :value="getRgb(color).g"
              type="number"
              min="0"
              max="255"
              class="w-full px-1 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
              @input="onRgbChange(i, 'g', ($event.target as HTMLInputElement).value)"
            >
            <input
              :value="getRgb(color).b"
              type="number"
              min="0"
              max="255"
              class="w-full px-1 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
              @input="onRgbChange(i, 'b', ($event.target as HTMLInputElement).value)"
            >
          </div>
        </div>
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
