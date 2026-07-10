import type Konva from 'konva'
import type { ElementChanges } from '@/engine'
import type { TextElement } from '@/engine'
import { normalizeTextMetrics } from '@/engine/text-metrics'
import { roundTo } from '@/lib/utils'

export function gridPositionFromNode(node: Konva.Node, cellSize: number): Pick<ElementChanges, 'x' | 'y'> {
  return {
    x: roundTo(node.x() / cellSize),
    y: roundTo(node.y() / cellSize),
  }
}

export function gridTransformFromNode(
  node: Konva.Node,
  cellSize: number,
  base: { width: number; height: number; fontSize?: number },
  scaleX = node.scaleX(),
  scaleY = node.scaleY(),
): ElementChanges {
  return {
    ...gridPositionFromNode(node, cellSize),
    width: roundTo(base.width * scaleX),
    height: roundTo(base.height * scaleY),
    rotation: roundTo(node.rotation()),
    ...(base.fontSize != null ? { fontSize: roundTo(base.fontSize * scaleY) } : {}),
  }
}

export function commitTransformFromNode(
  node: Konva.Node,
  cellSize: number,
  base: { width: number; height: number; fontSize?: number },
): ElementChanges {
  const scaleX = node.scaleX()
  const scaleY = node.scaleY()
  const changes = gridTransformFromNode(node, cellSize, base, scaleX, scaleY)
  node.scaleX(1)
  node.scaleY(1)
  return changes
}

export function commitTextTransformFromNode(
  node: Konva.Node,
  cellSize: number,
  base: { fontSize: number; text: string },
): ElementChanges {
  const scaleY = node.scaleY()
  const metrics = normalizeTextMetrics(base.text, base.fontSize * scaleY)
  node.scaleX(1)
  node.scaleY(1)
  return {
    ...gridPositionFromNode(node, cellSize),
    rotation: roundTo(node.rotation()),
    ...metrics,
  }
}

export function textTransformBase(element: TextElement) {
  return { width: element.width, height: element.height, fontSize: element.fontSize, text: element.text }
}
