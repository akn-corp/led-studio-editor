import {
  isPointInCross,
  isPointInEllipse,
  pointInPolygon,
  regularPolygonVertices,
  starVertices,
} from '@/engine/shapes/shape-geometry'

export type ShapeKind = 'square' | 'circle' | 'triangle' | 'star' | 'cross' | 'pentagon' | 'hexagon'

export interface ShapeDefinition {
  kind: ShapeKind
  label: string
  isPointInside(localX: number, localY: number, width: number, height: number): boolean
}

const shapes: ShapeDefinition[] = [
  {
    kind: 'square',
    label: 'Square',
    isPointInside: (x, y, width, height) => x >= 0 && x <= width && y >= 0 && y <= height,
  },
  {
    kind: 'circle',
    label: 'Circle',
    isPointInside: (x, y, width, height) => isPointInEllipse(x, y, width, height),
  },
  {
    kind: 'triangle',
    label: 'Triangle',
    isPointInside: (x, y, width, height) => pointInPolygon(x, y, regularPolygonVertices(3, width, height)),
  },
  {
    kind: 'star',
    label: 'Star',
    isPointInside: (x, y, width, height) => pointInPolygon(x, y, starVertices(width, height)),
  },
  {
    kind: 'cross',
    label: 'Cross',
    isPointInside: (x, y, width, height) => isPointInCross(x, y, width, height),
  },
  {
    kind: 'pentagon',
    label: 'Pentagon',
    isPointInside: (x, y, width, height) => pointInPolygon(x, y, regularPolygonVertices(5, width, height)),
  },
  {
    kind: 'hexagon',
    label: 'Hexagon',
    isPointInside: (x, y, width, height) => pointInPolygon(x, y, regularPolygonVertices(6, width, height)),
  },
]

const shapesByKind = new Map<ShapeKind, ShapeDefinition>(shapes.map((shape) => [shape.kind, shape]))

function getShapeDefinition(kind: ShapeKind): ShapeDefinition {
  return shapesByKind.get(kind) ?? shapes[0]
}

function listShapeKinds(): ShapeDefinition[] {
  return shapes
}

export { getShapeDefinition, listShapeKinds }
