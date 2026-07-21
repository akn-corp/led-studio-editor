export interface Point {
  x: number
  y: number
}

/**
 * Regular polygon inscribed in the (0,0)-(width,height) box, centered,
 * "pointy top" (first vertex straight up) — matches the usual look for
 * triangle/pentagon/hexagon. Non-square boxes stretch it via independent
 * x/y radii rather than clipping to a single radius.
 */
export function regularPolygonVertices(sides: number, width: number, height: number): Point[] {
  const cx = width / 2
  const cy = height / 2
  const rx = width / 2
  const ry = height / 2
  const vertices: Point[] = []
  for (let i = 0; i < sides; i += 1) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides
    vertices.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) })
  }
  return vertices
}

/** Alternating outer/inner vertices — a 5-point star has 10 vertices total. */
export function starVertices(
  width: number,
  height: number,
  points = 5,
  innerRatio = 0.5,
): Point[] {
  const cx = width / 2
  const cy = height / 2
  const outerRx = width / 2
  const outerRy = height / 2
  const innerRx = outerRx * innerRatio
  const innerRy = outerRy * innerRatio
  const vertices: Point[] = []
  const total = points * 2
  for (let i = 0; i < total; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / points
    const rx = i % 2 === 0 ? outerRx : innerRx
    const ry = i % 2 === 0 ? outerRy : innerRy
    vertices.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) })
  }
  return vertices
}

/** Standard ray-casting point-in-polygon test. */
export function pointInPolygon(x: number, y: number, vertices: Point[]): boolean {
  let inside = false
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i, i += 1) {
    const xi = vertices[i].x
    const yi = vertices[i].y
    const xj = vertices[j].x
    const yj = vertices[j].y
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

export function isPointInEllipse(x: number, y: number, width: number, height: number): boolean {
  const rx = width / 2
  const ry = height / 2
  if (rx <= 0 || ry <= 0) return false
  const dx = (x - rx) / rx
  const dy = (y - ry) / ry
  return dx * dx + dy * dy <= 1
}

const CROSS_THICKNESS_RATIO = 0.32

/** Two diagonal bars crossing at the center — an "X"/asterisk shape spanning the whole box. */
export function isPointInCross(x: number, y: number, width: number, height: number): boolean {
  const cx = width / 2
  const cy = height / 2
  const dx = x - cx
  const dy = y - cy
  const halfDiag = Math.sqrt(width * width + height * height) / 2
  const halfThickness = (Math.min(width, height) * CROSS_THICKNESS_RATIO) / 2

  for (const theta of [Math.PI / 4, -Math.PI / 4]) {
    const localX = dx * Math.cos(theta) + dy * Math.sin(theta)
    const localY = -dx * Math.sin(theta) + dy * Math.cos(theta)
    if (Math.abs(localX) <= halfDiag && Math.abs(localY) <= halfThickness) return true
  }
  return false
}

/** Builds the same two-bar path used by isPointInCross, for Konva/canvas drawing. */
export function traceCrossPath(
  context: { save(): void; translate(x: number, y: number): void; rotate(angle: number): void; rect(x: number, y: number, w: number, h: number): void; restore(): void },
  width: number,
  height: number,
): void {
  const cx = width / 2
  const cy = height / 2
  const halfDiag = Math.sqrt(width * width + height * height) / 2
  const halfThickness = (Math.min(width, height) * CROSS_THICKNESS_RATIO) / 2

  for (const theta of [Math.PI / 4, -Math.PI / 4]) {
    context.save()
    context.translate(cx, cy)
    context.rotate(theta)
    context.rect(-halfDiag, -halfThickness, halfDiag * 2, halfThickness * 2)
    context.restore()
  }
}
