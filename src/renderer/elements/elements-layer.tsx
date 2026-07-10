import { useEffect, useRef } from 'react'
import type Konva from 'konva'
import { Layer, Transformer } from 'react-konva'
import { ElementNode } from '@/renderer/elements/element-node'
import { computeCellSize } from '@/renderer/environment/cell-size'
import { selectionRectStore } from '@/renderer/selection-rect-store'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'
import { useViewport } from '@/state/use-viewport'

const MIN_TRANSFORM_SIZE = 5

function ElementsLayer() {
  const { project, environment, updateElement } = useScene()
  const { selectedElementId, select } = useSelection()
  const { size, scale, position } = useViewport()
  const cellSize = computeCellSize(environment.rows, environment.columns, size)

  const nodesRef = useRef(new Map<string, Konva.Node>())
  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return
    const node = selectedElementId ? nodesRef.current.get(selectedElementId) : undefined
    transformer.nodes(node ? [node] : [])
    transformer.getLayer()?.batchDraw()

    if (node) {
      const box = node.getClientRect()
      selectionRectStore.setRect({ x: box.x, y: box.y, width: box.width, height: box.height })
    } else {
      selectionRectStore.setRect(null)
    }
  }, [selectedElementId, project.elements, scale, position])

  return (
    <Layer>
      {project.elements.map((element) => {
        const registerNode = (node: Konva.Node | null) => {
          if (node) nodesRef.current.set(element.id, node)
          else nodesRef.current.delete(element.id)
        }
        const onSelect = () => select(element.id)
        const onChange = (changes: Parameters<typeof updateElement>[1]) =>
          updateElement(element.id, changes)

        return (
          <ElementNode
            key={element.id}
            element={element}
            cellSize={cellSize}
            onSelect={onSelect}
            onChange={onChange}
            registerNode={registerNode}
          />
        )
      })}
      <Transformer
        ref={transformerRef}
        rotateEnabled
        borderStroke="#3b82f6"
        anchorStroke="#3b82f6"
        anchorFill="#ffffff"
        anchorSize={8}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < MIN_TRANSFORM_SIZE || newBox.height < MIN_TRANSFORM_SIZE) {
            return oldBox
          }
          return newBox
        }}
      />
    </Layer>
  )
}

export { ElementsLayer }
