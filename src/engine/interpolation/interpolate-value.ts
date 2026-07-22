import { hexToRgb } from '@/engine/rasterize-leds'

function interpolateNumeric(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function interpolateColor(hexA: string, hexB: string, t: number): string {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  const r = Math.round(interpolateNumeric(a.r, b.r, t))
  const g = Math.round(interpolateNumeric(a.g, b.g, t))
  const bl = Math.round(interpolateNumeric(a.b, b.b, t))
  return `#${[r, g, bl].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

export { interpolateNumeric, interpolateColor }
