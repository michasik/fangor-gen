<script setup lang="ts">
const { applyPalette } = useGenerationParams()

const presets = [
  { name: 'Warm Circles', colors: ['#FF6B35', '#E8430A', '#FFB347'], bg: '#1A1A2E' },
  { name: 'Cool Depth', colors: ['#004E89', '#1A73B5', '#73C2FB'], bg: '#0D0D1A' },
  { name: 'Fangor Classic', colors: ['#FF6B35', '#004E89', '#F5E663'], bg: '#1A1A2E' },
  { name: 'Sunset', colors: ['#FF4E50', '#FC913A', '#F9D62E', '#EAE374'], bg: '#2C1320' },
  { name: 'Forest', colors: ['#2D5A27', '#5FAD56', '#A2D729'], bg: '#1A1C16' },
  { name: 'Neon Glow', colors: ['#FF00FF', '#00FFFF', '#FFFF00'], bg: '#0A0A0A' },
  { name: 'Monochrome', colors: ['#FFFFFF', '#AAAAAA', '#666666'], bg: '#111111' },
  { name: 'Earth Tones', colors: ['#8B4513', '#CD853F', '#DEB887', '#D2691E'], bg: '#1C1410' },
]

function apply(preset: typeof presets[number]) {
  applyPalette(preset.colors, preset.bg)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-xs font-medium uppercase tracking-wider text-neutral-500">Presets</label>
    <div class="grid grid-cols-4 gap-1.5">
      <button
        v-for="preset in presets"
        :key="preset.name"
        class="group relative h-8 rounded overflow-hidden border border-neutral-700 hover:border-indigo-500 transition-colors"
        :title="preset.name"
        @click="apply(preset)"
      >
        <div class="absolute inset-0 flex">
          <div
            v-for="(color, i) in preset.colors"
            :key="i"
            class="flex-1"
            :style="{ backgroundColor: color }"
          />
        </div>
      </button>
    </div>
  </div>
</template>
