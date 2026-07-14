import { KEYFRAME_TIME_EPSILON, type AnimatableProperty } from '@/engine/model/keyframe'
import type { Element, ElementChanges } from '@/engine/model/element'

function hasKeyframeTrack(element: Element, property: AnimatableProperty): boolean {
  return (element.keyframes[property]?.length ?? 0) > 0
}

/** Distinct keyframe times across all of an element's tracked properties, ascending — drives the one timeline row per element (grouped by time, not by property). */
function getElementKeyframeTimes(element: Element): number[] {
  const times: number[] = []
  for (const track of Object.values(element.keyframes)) {
    if (!track) continue
    for (const keyframe of track) {
      if (!times.some((time) => Math.abs(time - keyframe.time) <= KEYFRAME_TIME_EPSILON)) {
        times.push(keyframe.time)
      }
    }
  }
  return times.sort((a, b) => a - b)
}

/** Which tracked properties have a keyframe at (approximately) this time — used to move/remove a whole time-group together. */
function getPropertiesKeyframedAt(element: Element, time: number): AnimatableProperty[] {
  return (Object.keys(element.keyframes) as AnimatableProperty[]).filter((property) =>
    element.keyframes[property]?.some(
      (keyframe) => Math.abs(keyframe.time - time) <= KEYFRAME_TIME_EPSILON,
    ),
  )
}

/**
 * Splits a changes patch (e.g. from a canvas drag, which may touch several
 * properties at once) into keys that already have a keyframe track — these
 * must be recorded as keyframes to have any visible effect, since resolved
 * rendering ignores the base value once a track exists — and keys that
 * don't, which still mutate the base value like before Phase 4.
 */
function splitTrackedChanges(
  element: Element,
  changes: ElementChanges,
): { tracked: Partial<Record<AnimatableProperty, number | string>>; untracked: ElementChanges } {
  const tracked: Partial<Record<AnimatableProperty, number | string>> = {}
  const untracked: ElementChanges = {}

  for (const [key, value] of Object.entries(changes)) {
    const property = key as AnimatableProperty
    if (value === undefined) continue
    if (hasKeyframeTrack(element, property)) {
      tracked[property] = value as number | string
    } else {
      ;(untracked as Record<string, unknown>)[key] = value
    }
  }

  return { tracked, untracked }
}

export { hasKeyframeTrack, getElementKeyframeTimes, getPropertiesKeyframedAt, splitTrackedChanges }
