import { getVideoAnimationPreset } from '@/engine/animation-presets/video-presets'
import type { VideoPresetDelta } from '@/engine/animation-presets/video-types'
import type { VideoElement } from '@/engine/model/element'

const ENTER_DURATION = 0.5
const EXIT_DURATION = 0.5

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

function mergeDelta(a: VideoPresetDelta, b: VideoPresetDelta): VideoPresetDelta {
  return {
    x: (a.x ?? 0) + (b.x ?? 0),
    y: (a.y ?? 0) + (b.y ?? 0),
    opacityFactor: (a.opacityFactor ?? 1) * (b.opacityFactor ?? 1),
    sizeFactor: (a.sizeFactor ?? 1) * (b.sizeFactor ?? 1),
  }
}

function applyDelta(element: VideoElement, delta: VideoPresetDelta): VideoElement {
  const sizeFactor = delta.sizeFactor ?? 1
  return {
    ...element,
    x: element.x + (delta.x ?? 0),
    y: element.y + (delta.y ?? 0),
    opacity: element.opacity * (delta.opacityFactor ?? 1),
    width: element.width * sizeFactor,
    height: element.height * sizeFactor,
  }
}

/**
 * Layers Enter/Exit preset animation on top of an already keyframe-resolved
 * VideoElement — no Loop slot for video (unlike Text). Exit reuses each
 * preset's `enter` curve with progress running 1 -> 0 as the clip ends,
 * same technique as resolve-text-animation.ts.
 */
function applyVideoAnimation(element: VideoElement, t: number): VideoElement {
  const start = element.startTime
  const end = element.startTime + element.duration
  let delta: VideoPresetDelta = {}

  const enterPreset = getVideoAnimationPreset(element.enterAnimation)
  if (enterPreset) {
    const effectiveDuration = Math.min(ENTER_DURATION, element.duration / 2)
    if (effectiveDuration > 0 && t < start + effectiveDuration) {
      const progress = clamp01((t - start) / effectiveDuration)
      delta = mergeDelta(delta, enterPreset.enter(progress, element))
    }
  }

  const exitPreset = getVideoAnimationPreset(element.exitAnimation)
  if (exitPreset) {
    const effectiveDuration = Math.min(EXIT_DURATION, element.duration / 2)
    if (effectiveDuration > 0 && t > end - effectiveDuration) {
      const progress = clamp01((end - t) / effectiveDuration)
      delta = mergeDelta(delta, exitPreset.enter(progress, element))
    }
  }

  return applyDelta(element, delta)
}

export { applyVideoAnimation }
