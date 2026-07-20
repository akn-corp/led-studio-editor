import { expect, test } from 'vitest'
import { applyVideoAnimation } from '@/engine/animation-presets/resolve-video-animation'
import type { VideoElement } from '@/engine/model/element'

function makeVideo(overrides: Partial<VideoElement> = {}): VideoElement {
  return {
    id: 'video-1',
    type: 'video',
    x: 0,
    y: 0,
    width: 10,
    height: 6,
    rotation: 0,
    opacity: 1,
    keyframes: {},
    startTime: 0,
    duration: 4,
    hidden: false,
    fileName: 'clip.mp4',
    filePath: '/tmp/clip.mp4',
    sourceDuration: 10,
    thumbnailDataUrl: null,
    volume: 1,
    muted: true,
    playbackSpeed: 1,
    fit: 'cover',
    crop: null,
    filterPreset: 'none',
    borderRadius: 0,
    brightness: 1,
    enterAnimation: null,
    exitAnimation: null,
    ...overrides,
  }
}

test('no animation slots set leaves the element untouched', () => {
  const element = makeVideo()
  const resolved = applyVideoAnimation(element, 1)
  expect(resolved.opacity).toBe(1)
  expect(resolved.x).toBe(0)
})

test('fade enter ramps opacity from 0 to full over the enter window', () => {
  const element = makeVideo({ enterAnimation: 'fade' })
  expect(applyVideoAnimation(element, 0).opacity).toBeCloseTo(0, 5)
  expect(applyVideoAnimation(element, 0.25).opacity).toBeCloseTo(0.5, 5)
  expect(applyVideoAnimation(element, 0.5).opacity).toBeCloseTo(1, 5)
})

test('fade exit ramps opacity back down to 0 at clip end', () => {
  const element = makeVideo({ exitAnimation: 'fade', duration: 4 })
  expect(applyVideoAnimation(element, 3.5).opacity).toBeCloseTo(1, 5)
  expect(applyVideoAnimation(element, 4).opacity).toBeCloseTo(0, 5)
})

test('scale enter animation grows width/height together, keeping aspect ratio', () => {
  const element = makeVideo({ enterAnimation: 'scale', width: 10, height: 6, duration: 4 })
  const resolved = applyVideoAnimation(element, 0.25)
  expect(resolved.width).toBeCloseTo(5, 5)
  expect(resolved.height).toBeCloseTo(3, 5)
})

test('slideLeft/slideRight are mirror images and both fade in', () => {
  const left = applyVideoAnimation(makeVideo({ enterAnimation: 'slideLeft' }), 0.25)
  const right = applyVideoAnimation(makeVideo({ enterAnimation: 'slideRight' }), 0.25)
  expect(left.x).toBeGreaterThan(0)
  expect(right.x).toBeLessThan(0)
  expect(left.opacity).toBeCloseTo(right.opacity, 5)
})
