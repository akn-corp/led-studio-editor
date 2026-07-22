// Shared pixel scale so the ruler, playhead, audio waveform, and element
// keyframe rows all line up. LABEL_WIDTH is the fixed row-label column
// width every row (including the ruler, via a blank spacer) reserves
// before its time-scaled content starts, so `time * pixelsPerSecond`
// means the same on-screen x position everywhere.
export const LABEL_WIDTH = 96
export const MIN_PIXELS_PER_SECOND = 10
export const MAX_PIXELS_PER_SECOND = 200
export const DEFAULT_PIXELS_PER_SECOND = 40

export function timeToOffset(time: number, pixelsPerSecond: number) {
  return LABEL_WIDTH + time * pixelsPerSecond
}

export function offsetToTime(offset: number, pixelsPerSecond: number) {
  return Math.max(0, (offset - LABEL_WIDTH) / pixelsPerSecond)
}

export function trackWidthFor(duration: number, pixelsPerSecond: number) {
  return LABEL_WIDTH + duration * pixelsPerSecond
}
