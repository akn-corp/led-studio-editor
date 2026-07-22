import { expect, test } from 'vitest'
import { computeFitTransform } from '@/engine/fit-transform'

test('fill stretches to exactly the destination box, ignoring aspect ratio', () => {
  const result = computeFitTransform({
    sourceWidth: 1920,
    sourceHeight: 1080,
    destWidth: 100,
    destHeight: 100,
    fit: 'fill',
  })
  expect(result).toEqual({ drawWidth: 100, drawHeight: 100, offsetX: 0, offsetY: 0 })
})

test('cover scales up to fill a square box with a wide source, cropping width', () => {
  const result = computeFitTransform({
    sourceWidth: 1920,
    sourceHeight: 1080,
    destWidth: 100,
    destHeight: 100,
    fit: 'cover',
  })
  expect(result.drawHeight).toBe(100)
  expect(result.drawWidth).toBeGreaterThan(100)
  expect(result.offsetY).toBe(0)
  expect(result.offsetX).toBeLessThan(0)
})

test('contain scales down to fit a square box with a wide source, letterboxing height', () => {
  const result = computeFitTransform({
    sourceWidth: 1920,
    sourceHeight: 1080,
    destWidth: 100,
    destHeight: 100,
    fit: 'contain',
  })
  expect(result.drawWidth).toBe(100)
  expect(result.drawHeight).toBeLessThan(100)
  expect(result.offsetX).toBe(0)
  expect(result.offsetY).toBeGreaterThan(0)
})

test('matching aspect ratios produce no cropping or letterboxing for either cover or contain', () => {
  const cover = computeFitTransform({
    sourceWidth: 200,
    sourceHeight: 100,
    destWidth: 400,
    destHeight: 200,
    fit: 'cover',
  })
  const contain = computeFitTransform({
    sourceWidth: 200,
    sourceHeight: 100,
    destWidth: 400,
    destHeight: 200,
    fit: 'contain',
  })
  expect(cover).toEqual({ drawWidth: 400, drawHeight: 200, offsetX: 0, offsetY: 0 })
  expect(contain).toEqual({ drawWidth: 400, drawHeight: 200, offsetX: 0, offsetY: 0 })
})
