<script setup lang="ts">
const { params, applySeed } = useGenerationParams()

const editingSeed = ref(params.value.seed)
const copied = ref(false)

watch(() => params.value.seed, (newSeed) => {
  editingSeed.value = newSeed
})

function onSubmit() {
  const trimmed = editingSeed.value.trim()
  if (trimmed && trimmed !== params.value.seed) {
    applySeed(trimmed)
  }
}

async function copySeed() {
  await navigator.clipboard.writeText(params.value.seed)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm text-neutral-300">Seed</label>
    <div class="flex gap-1">
      <input
        v-model="editingSeed"
        type="text"
        class="flex-1 px-2 py-1 text-xs font-mono bg-neutral-800 border border-neutral-600 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
        @keydown.enter="onSubmit"
      >
      <button
        class="px-2 py-1 text-xs rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
        @click="copySeed"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <p class="text-[10px] text-neutral-500">Press Enter to apply</p>
  </div>
</template>
