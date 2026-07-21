import type { ShapeElement } from '@/engine/model/element'
import { getShapeDefinition } from '@/engine/shapes/shape-registry'

// Tests whether a point (in grid units) falls within a Shape element's
// silhouette (dispatched per shapeKind via the shape registry), accounting
// for rotation. Rotation pivots around the element's (x, y) — its top-left
// corner, matching Konva's default rotation origin — not its center. 2D
// only, per this tool's explicit scope: no 3D geometry/collision. Text/Video
// coverage doesn't use this — they're rasterized through the bitmap font /
// canvas sampling in rasterize-scene.ts instead.
function isPointInElement(pointX: number, pointY: number, element: ShapeElement): boolean {
  const dx = pointX - element.x
  const dy = pointY - element.y
  const theta = (element.rotation * Math.PI) / 180
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const localX = dx * cos + dy * sin
  const localY = -dx * sin + dy * cos
  return getShapeDefinition(element.shapeKind).isPointInside(localX, localY, element.width, element.height)
}

export { isPointInElement }
