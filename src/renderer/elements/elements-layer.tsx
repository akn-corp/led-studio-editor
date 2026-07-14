import { useEffect, useMemo, useRef } from 'react'
import type Konva from 'konva'
import { Layer, Transformer } from 'react-konva'
import { resolveSceneAtTime, splitTrackedChanges, type AnimatableProperty } from '@/engine'
import { ElementNode } from '@/renderer/elements/element-node'
import { computeCellSize } from '@/renderer/environment/cell-size'
import { selectionRectStore } from '@/renderer/selection-rect-store'
import { useDisplayMode } from '@/state/use-display-mode'
import { usePlayback } from '@/state/use-playback'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'
import { useViewport } from '@/state/use-viewport'

const MIN_TRANSFORM_SIZE = 5
const TRANSFORMER_ANCHORS = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

function ElementsLayer() {
  const { project, environment, updateElement, patchElement, addKeyframe } = useScene()
  const { mode } = useDisplayMode()
  const { selectedElementId, select } = useSelection()
  const { size, scale, position } = useViewport()
  const { currentTime } = usePlayback()
  const cellSize = computeCellSize(environment.rows, environment.columns, size)
  const showAuthoring = mode === 'edit'

  const elements = useMemo(
    () => resolveSceneAtTime(project, currentTime),
    [project, currentTime],
  )

  const nodesRef = useRef(new Map<string, Konva.Node>())
  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return
    if (!showAuthoring) {
      transformer.nodes([])
      selectionRectStore.setRect(null)
      return
    }
    const node = selectedElementId ? nodesRef.current.get(selectedElementId) : undefined
    transformer.nodes(node ? [node] : [])
    transformer.getLayer()?.batchDraw()

    if (node) {
      const box = node.getClientRect()
      selectionRectStore.setRect({ x: box.x, y: box.y, width: box.width, height: box.height })
    } else {
      selectionRectStore.setRect(null)
    }
  }, [selectedElementId, elements, scale, position, showAuthoring])

  const handleSize = 8 / scale
  const borderWidth = 2 / scale
  const rotateOffset = 28 / scale

  if (!showAuthoring) return null

  return (
    <Layer>
      {elements.map((element) => {
        const registerNode = (node: Konva.Node | null) => {
          if (node) nodesRef.current.set(element.id, node)
          else nodesRef.current.delete(element.id)
        }
        const onSelect = () => select(element.id)
        // Commit: properties with an active keyframe track record a keyframe
        // at the current playhead time instead of writing the base value —
        // once tracked, the base value is ignored by rendering.
        const onChange = (changes: Parameters<typeof updateElement>[1]) => {
          const { tracked, untracked } = splitTrackedChanges(element, changes)
          if (Object.keys(untracked).length > 0) updateElement(element.id, untracked)
          for (const [property, value] of Object.entries(tracked)) {
            addKeyframe(element.id, property as AnimatableProperty, currentTime, value)
          }
        }
        // Live drag preview: tracked properties are skipped (no live keyframe
        // scrubbing yet) — they snap to their new keyframed value on commit.
        const onPatch = (changes: Parameters<typeof patchElement>[1]) => {
          const { untracked } = splitTrackedChanges(element, changes)
          if (Object.keys(untracked).length > 0) patchElement(element.id, untracked)
        }

        return (
          <ElementNode
            key={element.id}
            element={element}
            cellSize={cellSize}
            showAuthoring={showAuthoring}
            onSelect={onSelect}
            onChange={onChange}
            onPatch={onPatch}
            registerNode={registerNode}
          />
        )
      })}
      {showAuthoring && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          rotateLineVisible
          rotateAnchorAngle={180}
          rotateAnchorOffset={rotateOffset}
          rotateAnchorCursor="grab"
          enabledAnchors={[...TRANSFORMER_ANCHORS]}
          anchorSize={handleSize}
          anchorStroke="#ffffff"
          anchorFill="#ffffff"
          anchorCornerRadius={handleSize / 2}
          borderStroke="#ffffff"
          borderStrokeWidth={borderWidth}
          boundBoxFunc={(oldBox, newBox) => {
            const activeAnchor = transformerRef.current?.getActiveAnchor()
            if (activeAnchor === 'rotater') return newBox

            if (newBox.width < MIN_TRANSFORM_SIZE || newBox.height < MIN_TRANSFORM_SIZE) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </Layer>
  )
}

export { ElementsLayer }
