import type { TextElement } from '@/engine/model/element'

export type AnimationPresetId =
  | 'fade'
  | 'scale'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'bounce'
  | 'spin'
  | 'wobble'
  | 'pulse'
  | 'typing'
  | 'marqueeLeft'
  | 'marqueeRight'

export interface PresetDelta {
  x?: number
  y?: number
  rotation?: number
  opacityFactor?: number
  fontSizeFactor?: number
  text?: string
}

export interface AnimationPreset {
  id: AnimationPresetId
  label: string
  /** Whether this preset is offered in the Loop picker (defines `loop`). */
  supportsLoop?: boolean
  /**
   * progress: 0 (not yet visible/settled) -> 1 (fully entered).
   * Reused for exit by passing a progress that runs 1 -> 0 as the clip ends,
   * so most presets don't need a distinct exit implementation.
   */
  enter(progress: number, element: TextElement): PresetDelta
  /** elapsedSeconds: time since the clip's startTime, unbounded — periodic. */
  loop?(elapsedSeconds: number, element: TextElement): PresetDelta
}
