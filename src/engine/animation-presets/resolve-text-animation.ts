import { measureBitmapText } from '@/engine/bitmap-font'
import { getAnimationPreset } from '@/engine/animation-presets/presets'
import type { PresetDelta } from '@/engine/animation-presets/types'
import type { TextElement } from '@/engine/model/element'

const ENTER_DURATION = 0.5
const EXIT_DURATION = 0.5

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

function mergeDelta(a: PresetDelta, b: PresetDelta): PresetDelta {
  return {
    x: (a.x ?? 0) + (b.x ?? 0),
    y: (a.y ?? 0) + (b.y ?? 0),
    rotation: (a.rotation ?? 0) + (b.rotation ?? 0),
    opacityFactor: (a.opacityFactor ?? 1) * (b.opacityFactor ?? 1),
    fontSizeFactor: (a.fontSizeFactor ?? 1) * (b.fontSizeFactor ?? 1),
    text: b.text ?? a.text,
  }
}

function applyDelta(element: TextElement, delta: PresetDelta): TextElement {
  const fontSize = element.fontSize * (delta.fontSizeFactor ?? 1)
  const text = delta.text ?? element.text
  const resized = delta.fontSizeFactor !== undefined || delta.text !== undefined

  return {
    ...element,
    x: element.x + (delta.x ?? 0),
    y: element.y + (delta.y ?? 0),
    rotation: element.rotation + (delta.rotation ?? 0),
    opacity: element.opacity * (delta.opacityFactor ?? 1),
    fontSize,
    text,
    ...(resized ? measureBitmapText(text, fontSize) : null),
  }
}

/**
 * Layers Enter/Loop/Exit preset animation on top of an already
 * keyframe-resolved TextElement. Exit reuses each preset's `enter` curve
 * with progress running 1 -> 0 as the clip ends, so most presets don't
 * need a distinct exit implementation (see AnimationPreset.enter doc).
 */
function applyTextAnimation(element: TextElement, t: number): TextElement {
  const start = element.startTime
  const end = element.startTime + element.duration
  const speed = element.animationSpeed > 0 ? element.animationSpeed : 1
  let delta: PresetDelta = {}

  const enterPreset = getAnimationPreset(element.enterAnimation)
  if (enterPreset) {
    const effectiveDuration = Math.min(ENTER_DURATION / speed, element.duration / 2)
    if (effectiveDuration > 0 && t < start + effectiveDuration) {
      const progress = clamp01((t - start) / effectiveDuration)
      delta = mergeDelta(delta, enterPreset.enter(progress, element))
    }
  }

  const exitPreset = getAnimationPreset(element.exitAnimation)
  if (exitPreset) {
    const effectiveDuration = Math.min(EXIT_DURATION / speed, element.duration / 2)
    if (effectiveDuration > 0 && t > end - effectiveDuration) {
      const progress = clamp01((end - t) / effectiveDuration)
      delta = mergeDelta(delta, exitPreset.enter(progress, element))
    }
  }

  const loopPreset = getAnimationPreset(element.loopAnimation)
  if (loopPreset?.loop) {
    delta = mergeDelta(delta, loopPreset.loop((t - start) * speed, element))
  }

  return applyDelta(element, delta)
}

export { applyTextAnimation }
