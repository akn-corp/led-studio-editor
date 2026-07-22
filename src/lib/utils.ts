import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Grid-unit values come from pixel math (drag position / cellSize, transform
// scale, ...) and pick up long floating-point tails that don't mean anything
// for LED positions. Round at the source, not just at display time, so the
// stored data stays clean everywhere it's read (Inspector, export, ...).
export function roundTo(value: number, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

// Renderer-side `file://` fetches/loads are blocked cross-origin (dev server
// runs on http://localhost); local media goes through the `local-file:`
// scheme the main process registers instead — see electron/main.ts. The
// host segment is a required-but-unused placeholder: `local-file:` is
// registered as a "standard" scheme, and the URL spec rejects an empty
// host for those (only `file:` gets that exemption).
export function toLocalFileUrl(absolutePath: string) {
  const url = new URL('local-file://local')
  url.pathname = absolutePath
  return url.href
}

// m:ss.d, matching the timeline transport's "0:00.0" display.
export function formatTime(seconds: number) {
  const clamped = Math.max(0, seconds)
  const minutes = Math.floor(clamped / 60)
  const rest = clamped - minutes * 60
  return `${minutes}:${rest.toFixed(1).padStart(4, '0')}`
}
