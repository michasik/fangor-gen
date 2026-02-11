<script setup lang="ts">
import { PARAM_LIMITS, type RingConfig } from '~/types/generation'
import { isValidHex, normalizeHex, hexToRgba } from '~/utils/color'

const props = defineProps<{
  ring: RingConfig
  index: number
  isExpanded: boolean
}>()

const emit = defineEmits<{
  update: [key: keyof RingConfig, value: string | number]
  'toggle-expand': []
  remove: []
}>()

const editingHex = ref('')
const isEditingHex = ref(false)
const colorMode = ref<'hex' | 'rgba'>('hex')

function getRgb(hex: string) {
  const { r, g, b } = hexToRgba(hex, 1)
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)))
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`.toUpperCase()
}

function onRgbChange(channel: 'r' | 'g' | 'b', value: string) {
  const num = parseInt(value, 10)
  if (isNaN(num)) return
  const current = getRgb(props.ring.color)
  current[channel] = num
  emit('update', 'color', rgbToHex(current.r, current.g, current.b))
}

function onHexInput(value: string) {
  editingHex.value = value
  isEditingHex.value = true
  if (isValidHex(value)) {
    emit('update', 'color', normalizeHex(value))
  }
}

function onHexBlur() {
  isEditingHex.value = false
}

function onPickerChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update', 'color', normalizeHex(value))
}

// Local v-model proxies for sliders
const diameterModel = computed({
  get: () => props.ring.diameter,
  set: (v: number) => emit('update', 'diameter', v),
})
const widthModel = computed({
  get: () => props.ring.width,
  set: (v: number) => emit('update', 'width', v),
})
const innerBlurModel = computed({
  get: () => props.ring.innerBlur,
  set: (v: number) => emit('update', 'innerBlur', v),
})
const outerBlurModel = computed({
  get: () => props.ring.outerBlur,
  set: (v: number) => emit('update', 'outerBlur', v),
})
</script>

<template>
  <div class="rounded-lg border border-neutral-700 bg-neutral-800/50 overflow-hidden">
    <!-- Collapsed header -->
    <button
      class="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-neutral-700/50 transition-colors"
      @click="emit('toggle-expand')"
    >
      <label class="relative w-6 h-6 rounded cursor-pointer overflow-hidden shrink-0 border border-neutral-600" @click.stop>
        <input
          type="color"
          :value="ring.color"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          @input="onPickerChange"
        >
        <div class="w-full h-full" :style="{ backgroundColor: ring.color }" />
      </label>
      <span class="text-sm text-neutral-200 flex-1">Ring {{ index + 1 }}</span>
      <span class="text-[10px] font-mono text-neutral-500">{{ ring.diameter }}% / {{ ring.width }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-neutral-500 transition-transform shrink-0"
        :class="{ 'rotate-180': isExpanded }"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <!-- Expanded content -->
    <div v-if="isExpanded" class="px-3 pb-3 pt-1 flex flex-col gap-3 border-t border-neutral-700">
      <!-- Color editing -->
      <div class="flex items-center gap-2">
        <div class="flex flex-col gap-0.5 flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <button
              class="px-1.5 py-0.5 text-[10px] rounded transition-colors"
              :class="colorMode === 'hex' ? 'bg-neutral-600 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'"
              @click="colorMode = 'hex'"
            >
              HEX
            </button>
            <button
              class="px-1.5 py-0.5 text-[10px] rounded transition-colors"
              :class="colorMode === 'rgba' ? 'bg-neutral-600 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'"
              @click="colorMode = 'rgba'"
            >
              RGB
            </button>
          </div>

          <input
            v-if="colorMode === 'hex'"
            :value="isEditingHex ? editingHex : ring.color"
            type="text"
            class="w-full px-2 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
            maxlength="7"
            @input="onHexInput(($event.target as HTMLInputElement).value)"
            @blur="onHexBlur"
          >

          <div v-else class="flex gap-1">
            <input
              :value="getRgb(ring.color).r"
              type="number"
              min="0"
              max="255"
              class="w-full px-1 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
              @input="onRgbChange('r', ($event.target as HTMLInputElement).value)"
            >
            <input
              :value="getRgb(ring.color).g"
              type="number"
              min="0"
              max="255"
              class="w-full px-1 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
              @input="onRgbChange('g', ($event.target as HTMLInputElement).value)"
            >
            <input
              :value="getRgb(ring.color).b"
              type="number"
              min="0"
              max="255"
              class="w-full px-1 py-0.5 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
              @input="onRgbChange('b', ($event.target as HTMLInputElement).value)"
            >
          </div>
        </div>
      </div>

      <!-- Parameter sliders -->
      <GeneratorParameterSlider
        v-model="diameterModel"
        label="Diameter"
        :min="PARAM_LIMITS.ringDiameter.min"
        :max="PARAM_LIMITS.ringDiameter.max"
        :step="PARAM_LIMITS.ringDiameter.step"
        unit="%"
      />

      <GeneratorParameterSlider
        v-model="widthModel"
        label="Width"
        :min="PARAM_LIMITS.ringWidth.min"
        :max="PARAM_LIMITS.ringWidth.max"
        :step="PARAM_LIMITS.ringWidth.step"
      />

      <GeneratorParameterSlider
        v-model="innerBlurModel"
        label="Inner Blur"
        :min="PARAM_LIMITS.ringBlur.min"
        :max="PARAM_LIMITS.ringBlur.max"
        :step="PARAM_LIMITS.ringBlur.step"
        :display-multiplier="100"
        unit="%"
      />

      <GeneratorParameterSlider
        v-model="outerBlurModel"
        label="Outer Blur"
        :min="PARAM_LIMITS.ringBlur.min"
        :max="PARAM_LIMITS.ringBlur.max"
        :step="PARAM_LIMITS.ringBlur.step"
        :display-multiplier="100"
        unit="%"
      />

      <button
        class="text-xs text-red-400 hover:text-red-300 self-end transition-colors"
        @click="emit('remove')"
      >
        Remove Ring
      </button>
    </div>
  </div>
</template>
