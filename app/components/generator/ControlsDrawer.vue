<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="props.open"
        class="fixed inset-0 bg-black/50 z-40"
        @click="emit('close')"
      />
    </Transition>
    <Transition name="slide-left">
      <aside
        v-if="props.open"
        class="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 bg-neutral-900/95 backdrop-blur-sm border-l border-neutral-700 p-4 overflow-y-auto flex flex-col gap-4"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-100">Controls</h2>
          <button
            class="p-1.5 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <GeneratorControlsContent />
      </aside>
    </Transition>
  </Teleport>
</template>
