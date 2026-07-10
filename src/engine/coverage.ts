import type { Element } from '@/engine/model/element'

// Tests whether a point (in grid units) falls within an element's bounds,
// accounting for rotation. Rotation pivots around the element's (x, y) —
// its top-left corner, matching Konva's default rotation origin — not its
// center. 2D only, per this tool's explicit scope: no 3D geometry/collision.
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

// Resolves which element (if any) covers a given point, in element order —
// later elements win on overlap, matching draw/z-order. This is the core
// test behind both the live LED-wall preview and, later, ExportAPI's
// per-LED state rasterization (see ARCHITECTURE.md, "Handoff to the routing
// tool"). Only element types that can currently cover LEDs participate here;
// text coverage is a deferred follow-up.
function resolveCoveringElement(
  elements: Element[],
  pointX: number,
  pointY: number,
): Element | null {
  let covering: Element | null = null
  for (const element of elements) {
    if (element.type !== 'square') continue
    if (isPointInElement(pointX, pointY, element)) covering = element
  }
  return covering
}

export { isPointInElement, resolveCoveringElement }
