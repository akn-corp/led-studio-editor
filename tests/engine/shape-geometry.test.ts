import { expect, test } from 'vitest'
import {
  isPointInCross,
  isPointInEllipse,
  pointInPolygon,
  regularPolygonVertices,
  starVertices,
} from '@/engine/shapes/shape-geometry'
import { getShapeDefinition, listShapeKinds } from '@/engine/shapes/shape-registry'

test('regularPolygonVertices produces the requested vertex count', () => {
  expect(regularPolygonVertices(3, 10, 10)).toHaveLength(3)
  expect(regularPolygonVertices(5, 10, 10)).toHaveLength(5)
  expect(regularPolygonVertices(6, 10, 10)).toHaveLength(6)
})

test('pointInPolygon: triangle center is inside, bounding-box corner is outside', () => {
  const vertices = regularPolygonVertices(3, 10, 10)
  expect(pointInPolygon(5, 5, vertices)).toBe(true)
  expect(pointInPolygon(0, 0, vertices)).toBe(false)
  expect(pointInPolygon(10, 10, vertices)).toBe(false)
})

test('pointInPolygon: pentagon center is inside, bounding-box corner is outside', () => {
  const vertices = regularPolygonVertices(5, 10, 10)
  expect(pointInPolygon(5, 5, vertices)).toBe(true)
  expect(pointInPolygon(0, 0, vertices)).toBe(false)
})

test('pointInPolygon: hexagon center is inside, bounding-box corner is outside', () => {
  const vertices = regularPolygonVertices(6, 10, 10)
  expect(pointInPolygon(5, 5, vertices)).toBe(true)
  expect(pointInPolygon(0, 0, vertices)).toBe(false)
})

test('starVertices produces 2*points vertices and center is inside', () => {
  const vertices = starVertices(10, 10)
  expect(vertices).toHaveLength(10)
  expect(pointInPolygon(5, 5, vertices)).toBe(true)
  expect(pointInPolygon(0, 0, vertices)).toBe(false)
})

test('isPointInEllipse: center is inside, bounding-box corner is outside', () => {
  expect(isPointInEllipse(5, 5, 10, 10)).toBe(true)
  expect(isPointInEllipse(0, 0, 10, 10)).toBe(false)
  expect(isPointInEllipse(10, 10, 10, 10)).toBe(false)
})

test('isPointInCross: center and diagonal arms are inside, corners between the arms are outside', () => {
  expect(isPointInCross(5, 5, 10, 10)).toBe(true)
  expect(isPointInCross(1, 1, 10, 10)).toBe(true)
  expect(isPointInCross(9, 1, 10, 10)).toBe(true)
  expect(isPointInCross(1, 5, 10, 10)).toBe(false)
})

test('shape registry has all 7 kinds and every isPointInside agrees with the center point', () => {
  const kinds = listShapeKinds()
  expect(kinds).toHaveLength(7)
  for (const shape of kinds) {
    expect(getShapeDefinition(shape.kind).isPointInside(5, 5, 10, 10)).toBe(true)
  }
})

test('getShapeDefinition falls back to square for an unknown kind', () => {
  // @ts-expect-error deliberately passing an invalid kind to exercise the fallback
  expect(getShapeDefinition('not-a-shape').kind).toBe('square')
})
