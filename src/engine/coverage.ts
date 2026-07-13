import type { Element } from '@/engine/model/element'

// Tests whether a point (in grid units) falls within a Square element's
// bounds, accounting for rotation. Rotation pivots around the element's
// (x, y) — its top-left corner, matching Konva's default rotation origin —
// not its center. 2D only, per this tool's explicit scope: no 3D
// geometry/collision. Text coverage doesn't use this — it's rasterized
// through the bitmap font in rasterize-scene.ts instead, since "does this
// point fall on a glyph" isn't a rectangle test.
function isPointInElement(pointX: number, pointY: number, element: Element): boolean {
  const dx = pointX - element.x
  const dy = pointY - element.y
  const theta = (element.rotation * Math.PI) / 180
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const localX = dx * cos + dy * sin
  const localY = -dx * sin + dy * cos
  return localX >= 0 && localX <= element.width && localY >= 0 && localY <= element.height
}

export { isPointInElement }
