<script setup lang="ts">
import { PARAM_LIMITS } from '~/types/generation'
import { normalizeHex } from '~/utils/color'

const { params, setRingProp, addRing, removeRing, reorderRings, setBackgroundColor } = useGenerationParams()

const expandedIndex = ref<number | null>(null)
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function toggleExpand(index: number) {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

function onRemoveRing(index: number) {
  if (params.value.rings.length <= PARAM_LIMITS.ringCount.min) return
  if (expandedIndex.value === index) expandedIndex.value = null
  else if (expandedIndex.value !== null && expandedIndex.value > index) expandedIndex.value--
  removeRing(index)
}

function onBgPickerChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  setBackgroundColor(normalizeHex(value))
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
    reorderRings(dragIndex.value, toIndex)
    // Update expanded index to follow the moved item
    if (expandedIndex.value === dragIndex.value) {
      expandedIndex.value = toIndex
    } else if (expandedIndex.value !== null) {
      if (dragIndex.value < expandedIndex.value && toIndex >= expandedIndex.value) {
        expandedIndex.value--
      } else if (dragIndex.value > expandedIndex.value && toIndex <= expandedIndex.value) {
        expandedIndex.value++
      }
    }
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
      <label class="text-sm text-neutral-300">Rings ({{ params.rings.length }})</label>
      <div class="flex gap-1">
        <button
          :disabled="params.rings.length <= PARAM_LIMITS.ringCount.min"
          class="px-2 py-0.5 text-sm rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="onRemoveRing(params.rings.length - 1)"
        >
          -
        </button>
        <button
          :disabled="params.rings.length >= PARAM_LIMITS.ringCount.max"
          class="px-2 py-0.5 text-sm rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="addRing"
        >
          +
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="(ring, i) in params.rings"
        :key="i"
        class="transition-colors rounded-lg"
        :class="{
          'opacity-50': dragIndex === i,
          'ring-1 ring-indigo-500': dragOverIndex === i && dragIndex !== i,
        }"
        :draggable="expandedIndex !== i"
        @dragstart="expandedIndex !== i && onDragStart(i, $event)"
        @dragover="expandedIndex !== i && onDragOver(i, $event)"
        @dragleave="expandedIndex !== i && onDragLeave()"
        @drop="expandedIndex !== i && onDrop(i, $event)"
        @dragend="expandedIndex !== i && onDragEnd()"
      >
        <GeneratorRingControl
          :ring="ring"
          :index="i"
          :is-expanded="expandedIndex === i"
          @update="(key, value) => setRingProp(i, key, value)"
          @toggle-expand="toggleExpand(i)"
          @remove="onRemoveRing(i)"
        />
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
