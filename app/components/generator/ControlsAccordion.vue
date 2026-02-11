<script setup lang="ts">
defineProps<{
  title: string
}>()

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="border border-neutral-700 rounded-lg overflow-hidden">
    <button
      class="w-full flex items-center justify-between px-4 py-3 bg-neutral-900/80 text-neutral-200 text-sm font-medium hover:bg-neutral-800 transition-colors"
      @click="toggle"
    >
      {{ title }}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <Transition name="accordion">
      <div v-show="isOpen" class="px-4 py-3 bg-neutral-900/60 flex flex-col gap-3">
        <slot />
      </div>
    </Transition>
  </div>
</template>
