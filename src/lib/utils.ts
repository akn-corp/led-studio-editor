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
