import type { Prng } from './prng'

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value)
}

export function normalizeHex(value: string): string {
  let hex = value.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex[0]! + hex[0]! + hex[1]! + hex[1]! + hex[2]! + hex[2]!
  }
  return `#${hex.toUpperCase()}`
}

export function randomHexColor(rng: Prng): string {
  const r = Math.floor(rng() * 256)
  const g = Math.floor(rng() * 256)
  const b = Math.floor(rng() * 256)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
}

export function hexToRgba(hex: string, alpha: number): { r: number; g: number; b: number; a: number } {
  const normalized = normalizeHex(hex)
  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  return { r, g, b, a: alpha }
}

export function rgbaString(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
