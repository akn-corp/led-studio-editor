import type { EasingType } from '@/engine/model/keyframe'

type Easing = (t: number) => number

const easings: Record<EasingType, Easing> = {
  linear: (t) => t,
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
}

function applyEasing(type: EasingType, t: number): number {
  return easings[type](t)
}

export { applyEasing }
