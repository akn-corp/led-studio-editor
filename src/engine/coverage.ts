import type { ShapeElement } from '@/engine/model/element'
import { getShapeDefinition } from '@/engine/shapes/shape-registry'

// Tests whether a point (in grid units) falls within a Shape element's
// silhouette (dispatched per shapeKind via the shape registry), accounting
// for rotation. Rotation pivots around the element's own center — so a
// Spin/Wobble animation, which only changes `rotation` and leaves (x, y)
// fixed, turns the shape in place rather than swinging it around its
// top-left corner. 2D only, per this tool's explicit scope: no 3D
// geometry/collision. Text/Video coverage doesn't use this — they're
// rasterized through the bitmap font / canvas sampling in
// rasterize-scene.ts instead.
function isPointInElement(pointX: number, pointY: number, element: ShapeElement): boolean {
  const halfWidth = element.width / 2
  const halfHeight = element.height / 2
  const cx = element.x + halfWidth
  const cy = element.y + halfHeight
  const dx = pointX - cx
  const dy = pointY - cy
  const theta = (element.rotation * Math.PI) / 180
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const localX = dx * cos + dy * sin + halfWidth
  const localY = -dx * sin + dy * cos + halfHeight
  return getShapeDefinition(element.shapeKind).isPointInside(localX, localY, element.width, element.height)
}

export { isPointInElement }
