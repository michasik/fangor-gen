# fangorGen

Generative op-art inspired by [Wojciech Fangor](https://en.wikipedia.org/wiki/Wojciech_Fangor). Create concentric ring compositions with sfumato blur effects, seed-based reproducibility, and fine-grained parameter control.

## Features

- **Seed-based generation** — deterministic PRNG ensures the same seed always produces the same artwork
- **Configurable rings** — up to 6 concentric rings, each with independent color, width, diameter, and inner/outer blur
- **Composition controls** — blur intensity, center offset (X/Y), background color
- **Canvas settings** — multiple aspect ratios (1:1, 4:3, 3:4, 16:9, 9:16) and sizes (1024px, 2048px, 4096px)
- **Palette presets** — quick-apply color schemes while preserving ring geometry
- **Randomize** — generate entirely new compositions or randomize individual parameters
- **Responsive layout** — side-by-side on desktop, drawer on tablet, accordion on mobile

## Tech Stack

- [Nuxt 4](https://nuxt.com) / [Vue 3](https://vuejs.org) (Composition API)
- [Tailwind CSS 4](https://tailwindcss.com)
- [seedrandom](https://github.com/davidbau/seedrandom) for deterministic RNG
- HTML5 Canvas API for rendering

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview  # preview production build locally
```
