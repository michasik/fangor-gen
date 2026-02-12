<template>
  <div class="home-hero">
    <div class="home-bg" />
    <div class="home-overlay" />

    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <h1 class="text-5xl font-bold text-white tracking-tight drop-shadow-lg">
        fangorGen
      </h1>
      <p class="text-lg text-white/60">
        Generate op-art inspired by Wojciech Fangor
      </p>
      <NuxtLink to="/create" class="glass-btn">
        Start Creating
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.home-bg {
  position: absolute;
  inset: -20px;
  background: url('/fAIngor_002.avif') center / cover no-repeat;
  animation: bgPulse 8s ease-in-out infinite;
  will-change: transform, filter;
}

.home-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%);
  animation: overlayShift 10s ease-in-out infinite;
  will-change: background;
}

@keyframes bgPulse {
  0%, 100% {
    transform: scale(1);
    filter: brightness(0.85) saturate(1) hue-rotate(0deg);
  }
  33% {
    transform: scale(1.03);
    filter: brightness(0.95) saturate(1.15) hue-rotate(8deg);
  }
  66% {
    transform: scale(1.01);
    filter: brightness(0.80) saturate(1.1) hue-rotate(-6deg);
  }
}

@keyframes overlayShift {
  0%, 100% {
    background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%);
  }
  50% {
    background: radial-gradient(ellipse at center, transparent 20%, rgba(10, 5, 30, 0.55) 100%);
  }
}

/* Apple glass button */
.glass-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 40px;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.01em;
  border-radius: 980px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;
  user-select: none;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transform: scale(1.04);
}

.glass-btn:active {
  background: rgba(255, 255, 255, 0.06);
  transform: scale(0.98);
  transition-duration: 0.1s;
}
</style>
