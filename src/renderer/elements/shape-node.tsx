import { useRef } from 'react'
import type Konva from 'konva'
import { Shape } from 'react-konva'
import type { ElementChanges, ShapeElement, ShapeKind } from '@/engine'
import {
  regularPolygonVertices,
  starVertices,
  traceCrossPath,
  type Point,
} from '@/engine/shapes/shape-geometry'
import { AUTHORING_GHOST_OPACITY } from '@/renderer/elements/authoring-constants'
import {
  commitTransformFromNode,
  gridPositionFromNode,
} from '@/renderer/elements/element-transform'

function tracePolygon(context: Konva.Context, vertices: Point[]) {
  vertices.forEach((vertex, index) => {
    if (index === 0) context.moveTo(vertex.x, vertex.y)
    else context.lineTo(vertex.x, vertex.y)
  })
}

function traceShapePath(context: Konva.Context, shapeKind: ShapeKind, width: number, height: number) {
  context.beginPath()
  switch (shapeKind) {
    case 'square':
      context.rect(0, 0, width, height)
      break
    case 'circle':
      context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      break
    case 'triangle':
      tracePolygon(context, regularPolygonVertices(3, width, height))
      break
    case 'pentagon':
      tracePolygon(context, regularPolygonVertices(5, width, height))
      break
    case 'hexagon':
      tracePolygon(context, regularPolygonVertices(6, width, height))
      break
    case 'star':
      tracePolygon(context, starVertices(width, height))
      break
    case 'cross':
      traceCrossPath(context, width, height)
      break
    default: {
      const exhaustiveCheck: never = shapeKind
      return exhaustiveCheck
    }
  }
  context.closePath()
}

function ShapeNode({
  element,
  cellSize,
  showAuthoring,
  onSelect,
  onChange,
  onPatch,
  registerNode,
}: {
  element: ShapeElement
  cellSize: number
  showAuthoring: boolean
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  onPatch: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}) {
  const transformBaseRef = useRef({ width: element.width, height: element.height })

  if (!showAuthoring) return null

  return (
    <Shape
      ref={registerNode}
      x={element.x * cellSize}
      y={element.y * cellSize}
      width={element.width * cellSize}
      height={element.height * cellSize}
      rotation={element.rotation}
      opacity={AUTHORING_GHOST_OPACITY}
      fill={element.fill}
      stroke={element.fill}
      strokeWidth={1}
      dash={[4, 4]}
      draggable
      onClick={(e) => {
        e.cancelBubble = true
        onSelect()
      }}
      onDragStart={onSelect}
      onDragMove={(e) => {
        onPatch(gridPositionFromNode(e.target, cellSize))
      }}
      onDragEnd={(e) => {
        onChange(gridPositionFromNode(e.target, cellSize))
      }}
      onTransformStart={() => {
        transformBaseRef.current = { width: element.width, height: element.height }
      }}
      onTransformEnd={(e) => {
        onChange(commitTransformFromNode(e.target, cellSize, transformBaseRef.current))
      }}
      sceneFunc={(context, shape) => {
        traceShapePath(context, element.shapeKind, element.width * cellSize, element.height * cellSize)
        context.fillStrokeShape(shape)
      }}
    />
  )
}

export { ShapeNode }
