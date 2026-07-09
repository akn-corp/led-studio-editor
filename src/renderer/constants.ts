// Shared across every renderer/ Stage — not specific to the LED grid, since
export const MIN_SCALE = 0.2
export const MAX_SCALE = 4

// Wheel zoom fires many events per scroll gesture, so each one is a small step
export const WHEEL_SCALE_STEP = 1.05
export const BUTTON_SCALE_STEP = 1.2

export const ZOOM_PRESETS = [2, 1, 0.5, 0.25] as const

export const VIEWPORT_PADDING = 72
