import { afterEach, expect, test } from 'vitest'
import {
  entityIdForCell,
  getAllWallLedChunks,
  getWallMapping,
  resetWallMapping,
  setWallMapping,
} from '../src/engine/wall-mapping.ts'

afterEach(() => {
  resetWallMapping()
})

test('maps the first visible column from top to bottom on the ascending strip', () => {
  expect(entityIdForCell(0, 0)).toBe(228)
  expect(entityIdForCell(127, 0)).toBe(101)
})

test('maps the second visible column from top to bottom on the descending strip', () => {
  expect(entityIdForCell(0, 1)).toBe(230)
  expect(entityIdForCell(127, 1)).toBe(357)
})

test('maps the next column pair to the next 259-LED physical band', () => {
  expect(entityIdForCell(0, 2)).toBe(528)
  expect(entityIdForCell(0, 3)).toBe(530)
})

test('rejects cells outside the visible 128 by 128 matrix', () => {
  expect(entityIdForCell(-1, 0)).toBeNull()
  expect(entityIdForCell(128, 0)).toBeNull()
  expect(entityIdForCell(0, 128)).toBeNull()
})

test('setWallMapping updates chunks and entity mapping', () => {
  setWallMapping({
    columns: 2,
    bands: [
      { column: 0, entityStart: 100, entityCount: 170 },
      { column: 1, entityStart: 270, entityCount: 89 },
    ],
    profile: 'test',
  })

  expect(getWallMapping().profile).toBe('test')
  expect(getAllWallLedChunks()).toHaveLength(2)
  expect(entityIdForCell(0, 0)).toBe(228)
})

test('setWallMapping rejects invalid payload', () => {
  expect(() =>
    setWallMapping({
      columns: 1,
      bands: [],
    }),
  ).toThrow(/bands/)
})
