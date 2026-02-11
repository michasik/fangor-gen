# FangorGen - Op-Art Image Generator

## Overview

A web application that generates op-art images inspired by the paintings of **Wojciech Fangor** (1922-2015), the celebrated Polish painter known for his concentric circle compositions with soft, blurred edges that create illusions of depth, pulsation, and spatial uncertainty.

The app allows users to configure colors, randomize compositions, preview results on a live canvas, and export print-ready PDFs.

---

## Core Visual Characteristics to Reproduce

Fangor's signature style features:

1. **Concentric circles/rings** radiating from a focal point with varying ring widths
2. **Soft, blurred edges (sfumato)** - color boundaries are never sharp; they dissolve into gradual gradients
3. **Pulsating depth illusion** - rings appear to hover, expand, and retreat
4. **Expressive color relationships** - adjacent rings interact through carefully chosen hue, saturation, and brightness variations
5. **Background bleeding** - outermost rings fade softly into the background color
6. **Off-center compositions** - the focal point is not always centered; slight displacement adds dynamism

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 (already scaffolded) |
| UI / Styling | Tailwind CSS 4 |
| Canvas rendering | HTML5 `<canvas>` 2D API |
| PDF generation | `jsPDF` (client-side) |
| Color picker | `@vueuse/components` EyeDropper + custom picker component |
| State management | Vue 3 Composition API (`ref`, `reactive`, `computed`) |

---

## Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing / hero page with brief intro and "Start Creating" CTA |
| `/create` | Main generator workspace (canvas + controls) |

---

## Feature Specification

### F1 - Color Configuration

#### F1.1 - Number of Colors
- Slider or stepper input to select **2 to 6** colors
- Default: **3**
- Changing the count adjusts the color palette slots visible in the UI

#### F1.2 - Color Selection
Each color slot supports three input methods (tabs or auto-detect):

| Method | Input |
|--------|-------|
| **Hex** | Text field accepting `#RRGGBB` or `#RGB` format with validation |
| **RGBA** | Four numeric fields: R (0-255), G (0-255), B (0-255), A (0-1) |
| **Color picker** | Native `<input type="color">` combined with an opacity slider for alpha |

- Each slot shows a live color preview swatch
- Drag-and-drop reordering of color slots to control ring order

#### F1.3 - Predefined Palettes
- Provide 5-8 curated palettes inspired by actual Fangor paintings (e.g., warm rings on dark background, cool blues with violet accents)
- Clicking a palette auto-fills all color slots
- Palettes serve as starting points; users can modify individual colors after selection

### F2 - Generation Parameters

#### F2.1 - Composition Controls

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| Ring count | Slider | 3 - 20 | 8 | Number of concentric rings |
| Blur intensity | Slider | 0 - 100% | 60% | How much sfumato is applied to ring edges |
| Center X offset | Slider | -50% to +50% | 0% | Horizontal displacement of the focal point |
| Center Y offset | Slider | -50% to +50% | 0% | Vertical displacement of the focal point |
| Ring width variance | Slider | 0 - 100% | 30% | How much ring widths vary (0 = uniform) |
| Background color | Color input | any | `#1a1a1a` | Canvas background; outermost ring fades into this |
| Aspect ratio | Select | 1:1, 4:3, 3:4, 16:9, 9:16, Custom | 1:1 | Canvas proportions |
| Canvas size | Select | Small (1024px), Medium (2048px), Large (4096px) | Medium | Longest edge in pixels |

#### F2.2 - Randomize All
- Single button that randomizes **every** parameter (colors, ring count, blur, offsets, widths)
- Uses seeded PRNG so the result can be reproduced via a **seed** field
- Seed is displayed and editable; pasting a seed regenerates the exact same image

#### F2.3 - Randomize Partial
- Individual "dice" icon next to each parameter to randomize only that value

### F3 - Canvas Rendering

#### F3.1 - Rendering Algorithm

```
For each ring (outermost to innermost):
  1. Determine ring color from palette (cycle if rings > colors)
  2. Calculate inner and outer radius based on ring index and width variance
  3. Draw filled circle at (centerX, centerY) with outer radius
  4. Apply radial gradient from ring color (solid at center of ring band)
     to transparent at both inner and outer edges to create sfumato blur
  5. Composite using appropriate blend mode
```

- Use `CanvasRenderingContext2D` radial gradients for the blur effect
- Consider `globalCompositeOperation` for color interaction between overlapping rings
- Render at the selected canvas size for full resolution

#### F3.2 - Live Preview
- Render a downscaled preview (max 800px) on every parameter change
- Debounce rendering by 150ms to prevent jank during slider drags
- Show a subtle loading indicator during renders

#### F3.3 - Full Resolution Render
- Triggered by "Generate HD" button
- Renders at the full selected canvas size (up to 4096px)
- Shows progress indicator
- Result is displayed in a zoomable/pannable preview

### F4 - Image Acceptance & Export

#### F4.1 - Accept / Reject Flow
- After generation, user sees the preview with two primary actions:
  - **Accept** - proceeds to export options
  - **Regenerate** - re-randomizes and generates a new image
  - **Tweak** - returns to parameter controls with current settings preserved

#### F4.2 - Export as PNG
- Download the full-resolution canvas as PNG
- Filename format: `fangor-gen-{seed}-{timestamp}.png`

#### F4.3 - Export as Print-Ready PDF

| Setting | Options | Default |
|---------|---------|---------|
| Paper size | A4, A3, A2, US Letter, Custom (mm) | A4 |
| Orientation | Portrait, Landscape | Portrait |
| Margins | None, Small (10mm), Medium (20mm), Custom (mm) | Small |
| DPI | 150, 300 | 300 |
| Color profile note | Display a note that colors are in sRGB; professional printing may require CMYK conversion | - |

- Generate PDF client-side using `jsPDF`
- Embed the rendered canvas image scaled to fit the selected paper size minus margins
- Center the image on the page
- Filename format: `fangor-gen-{seed}-{paperSize}.pdf`

### F5 - Gallery / History (optional enhancement)

- Store last 10 generated images in `localStorage` (as seeds + parameters, not pixel data)
- Thumbnail strip below the canvas for quick recall
- Click a thumbnail to reload its parameters and re-render

---

## UI / Layout

### `/create` Page Layout

```
+------------------------------------------------------------------+
|  Header: Logo / App Name              [Gallery] [About]          |
+------------------------------------------------------------------+
|                          |                                       |
|   CONTROLS PANEL         |        CANVAS PREVIEW                 |
|   (scrollable sidebar)   |        (centered, responsive)         |
|                          |                                       |
|   [Palette presets]      |        +---------------------+        |
|   [Color slots 1..N]     |        |                     |        |
|   [Ring count]           |        |    Generated Art     |        |
|   [Blur intensity]       |        |                     |        |
|   [Center offsets]       |        +---------------------+        |
|   [Width variance]       |                                       |
|   [Background color]     |        [Regenerate] [Accept]          |
|   [Aspect ratio]         |                                       |
|   [Canvas size]          |                                       |
|   [Seed]                 |                                       |
|                          |                                       |
|   [Randomize All]        |        [Gallery thumbnails...]        |
|   [Generate HD]          |                                       |
|                          |                                       |
+------------------------------------------------------------------+
```

### Responsive Behavior

| Breakpoint | Layout |
|-----------|--------|
| >= 1024px (lg) | Side-by-side: controls left, canvas right |
| 768-1023px (md) | Controls collapse into a toggleable drawer; canvas full width |
| < 768px (sm) | Stacked: canvas on top, controls below in accordion sections |

### Design Tokens

- Dark theme by default (complements Fangor's typical dark backgrounds)
- Neutral grays for UI chrome so colors in the canvas are the visual focus
- Subtle glassmorphism for the controls panel
- Smooth transitions on all interactive elements

---

## Rendering Pipeline (Technical Detail)

### Step-by-step Algorithm

```typescript
interface GenerationParams {
  colors: string[]           // hex colors in ring order
  ringCount: number          // 3-20
  blurIntensity: number      // 0-1
  centerX: number            // 0-1 (0.5 = centered)
  centerY: number            // 0-1
  ringWidthVariance: number  // 0-1
  backgroundColor: string    // hex
  width: number              // px
  height: number             // px
  seed: string               // PRNG seed
}
```

1. **Initialize canvas** at `width x height`, fill with `backgroundColor`
2. **Seed PRNG** with `seed` value
3. **Calculate ring radii**: distribute `ringCount` rings from max radius (covering canvas diagonal) down to a minimum core radius. Apply `ringWidthVariance` by perturbing widths with PRNG.
4. **For each ring** (outer to inner):
   a. Select color: `colors[i % colors.length]`
   b. Create radial gradient centered at `(centerX * width, centerY * height)`:
      - At inner edge of ring band: transparent
      - At peak of ring band: full color with `blurIntensity` controlling gradient spread
      - At outer edge of ring band: transparent
   c. Draw filled circle with the gradient
5. **Post-processing** (optional): apply a very subtle canvas filter for additional softness (`ctx.filter = 'blur(Npx)'` on a final composite pass if blur intensity is very high)

### Performance Considerations

- Preview renders at max 800px longest edge
- Full renders are offloaded to a Web Worker (via `OffscreenCanvas` where supported) to keep the UI responsive
- Debounce parameter changes (150ms) before triggering preview re-render

---

## Data Model

### Composition (persisted to localStorage for gallery)

```typescript
interface Composition {
  id: string                    // UUID
  seed: string
  params: GenerationParams
  createdAt: string             // ISO timestamp
  thumbnail?: string            // base64 data URL (small, ~100px)
}
```

---

## Dependencies to Install

| Package | Purpose |
|---------|---------|
| `jspdf` | Client-side PDF generation |
| `seedrandom` | Seeded PRNG for reproducible randomization |

All other functionality uses built-in browser APIs and Vue/Nuxt ecosystem already present.

---

## Implementation Phases

### Phase 1 - Core Generator
- [ ] Canvas rendering composable (`useCanvasRenderer`)
- [ ] Basic concentric circle algorithm with blur
- [ ] Color input (hex only) with configurable count
- [ ] Ring count and blur sliders
- [ ] Randomize All with seed

### Phase 2 - Full Controls & UI
- [ ] Complete parameter panel (all sliders, offsets, variance)
- [ ] Color picker with hex/rgba/native picker tabs
- [ ] Predefined palette selection
- [ ] Drag-and-drop color reordering
- [ ] Responsive layout with sidebar/drawer/stacked modes
- [ ] Dark theme styling

### Phase 3 - Export
- [ ] PNG download at full resolution
- [ ] PDF generation with paper size, orientation, margins, DPI settings
- [ ] Export settings modal/panel

### Phase 4 - Polish & Enhancements
- [ ] Gallery/history in localStorage
- [ ] Web Worker rendering for large canvases
- [ ] Seed sharing (URL query params)
- [ ] Landing page (`/`)
- [ ] Accessibility audit (keyboard navigation, screen reader labels)
- [ ] Performance optimization pass

---

## Non-Functional Requirements

| Requirement | Target |
|------------|--------|
| First Contentful Paint | < 1.5s |
| Preview render time | < 200ms at 800px |
| Full render time (4096px) | < 2s |
| PDF generation | < 3s |
| Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Accessibility | WCAG 2.1 AA (controls and navigation; canvas art is inherently visual) |
| No server-side processing | All generation and export happens client-side |
