// Konva renders to a <canvas>, not the DOM, so it can't read our CSS custom
// properties — colors here are fixed constants instead of Tailwind classes.
export const LED_COLOR = '#9ca3af'
export const SELECTION_COLOR = '#3b82f6'

// Grid sizing: denser grids get tighter spacing automatically so a 128x128
// wall still fits on screen without forcing the user to zoom out first.
export const MIN_CELL_SIZE = 4
export const MAX_CELL_SIZE = 32
export const VIEWPORT_PADDING = 48

// Stage zoom
export const MIN_SCALE = 0.2
export const MAX_SCALE = 4
export const SCALE_STEP = 1.05
