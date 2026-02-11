<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-8 px-4">
    <div class="text-center">
      <h1 class="text-5xl font-bold text-white tracking-tight">
        fangorGen
      </h1>
      <p class="mt-3 text-lg text-neutral-400">
        Generate op-art inspired by Wojciech Fangor
      </p>
    </div>
    <NuxtLink
      to="/create"
      class="px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-500 transition-colors"
    >
      Start Creating
    </NuxtLink>
  </div>
</template>
