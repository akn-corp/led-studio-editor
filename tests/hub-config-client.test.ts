import { expect, test } from 'vitest'
import { parseWallBandsJson } from '../src/engine/hub-config-client.ts'

test('parseWallBandsJson accepts a valid mapping', () => {
  const mapping = parseWallBandsJson(
    JSON.stringify({
      columns: 2,
      bands: [
        { column: 0, entityStart: 100, entityCount: 170 },
        { column: 1, entityStart: 270, entityCount: 89 },
      ],
    }),
  )
  expect(mapping.columns).toBe(2)
  expect(mapping.bands[0].entityStart).toBe(100)
})

test('parseWallBandsJson rejects invalid JSON shape', () => {
  expect(() => parseWallBandsJson('{"columns":2,"bands":[]}')).toThrow(/bands/)
  expect(() => parseWallBandsJson('not-json')).toThrow(/JSON/)
})
