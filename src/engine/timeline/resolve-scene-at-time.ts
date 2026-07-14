import { applyEasing } from '@/engine/interpolation/easing'
import { interpolateColor, interpolateNumeric } from '@/engine/interpolation/interpolate-value'
import { applyTextAnimation } from '@/engine/animation-presets/resolve-text-animation'
import { ANIMATABLE_PROPERTY_KIND, type AnimatableProperty, type Keyframe } from '@/engine/model/keyframe'
import type { Element } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

function isElementVisibleAt(element: Element, t: number): boolean {
  return !element.hidden && t >= element.startTime && t <= element.startTime + element.duration
}

function resolveTrackValueAtTime(
  track: Keyframe[],
  property: AnimatableProperty,
  t: number,
  fallback: number | string,
): number | string {
  if (track.length === 0) return fallback

  const first = track[0]
  if (t <= first.time) return first.value

  const last = track[track.length - 1]
  if (t >= last.time) return last.value

  let from = first
  let to = last
  for (let i = 0; i < track.length - 1; i += 1) {
    if (track[i].time <= t && t <= track[i + 1].time) {
      from = track[i]
      to = track[i + 1]
      break
    }
  }

  const span = to.time - from.time
  const localT = span === 0 ? 0 : (t - from.time) / span
  const easedT = applyEasing(from.easing, localT)

  return ANIMATABLE_PROPERTY_KIND[property] === 'color'
    ? interpolateColor(String(from.value), String(to.value), easedT)
    : interpolateNumeric(Number(from.value), Number(to.value), easedT)
}

function resolveElementAtTime(element: Element, t: number): Element {
  let resolved = { ...element }

  for (const [property, track] of Object.entries(element.keyframes) as [
    AnimatableProperty,
    Keyframe[],
  ][]) {
    if (!track || track.length === 0) continue
    const fallback = (element as unknown as Record<AnimatableProperty, number | string>)[property]
    const value = resolveTrackValueAtTime(track, property, t, fallback)
    ;(resolved as unknown as Record<AnimatableProperty, number | string>)[property] = value
  }

  if (resolved.type === 'text') {
    resolved = applyTextAnimation(resolved, t)
  }

  return resolved
}

function resolveSceneAtTime(project: Project, t: number): Element[] {
  return project.elements
    .filter((element) => isElementVisibleAt(element, t))
    .map((element) => resolveElementAtTime(element, t))
}

export { resolveElementAtTime, resolveSceneAtTime }
