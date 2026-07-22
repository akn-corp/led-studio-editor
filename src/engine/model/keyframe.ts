export type EasingType = 'linear' | 'easeInOut'

export interface Keyframe {
  time: number
  value: number | string
  easing: EasingType
}

export type AnimatableProperty =
  | 'x'
  | 'y'
  | 'width'
  | 'height'
  | 'rotation'
  | 'opacity'
  | 'fill'
  | 'fontSize'

export type KeyframeTracks = Partial<Record<AnimatableProperty, Keyframe[]>>

/** Two keyframe times within this many seconds are treated as "the same moment" for upsert/move/remove/grouping. */
export const KEYFRAME_TIME_EPSILON = 0.01

export const ANIMATABLE_PROPERTY_KIND: Record<AnimatableProperty, 'number' | 'color'> = {
  x: 'number',
  y: 'number',
  width: 'number',
  height: 'number',
  rotation: 'number',
  opacity: 'number',
  fill: 'color',
  fontSize: 'number',
}
