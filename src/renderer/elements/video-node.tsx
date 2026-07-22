import { useEffect, useRef } from 'react'
import type Konva from 'konva'
import { Shape } from 'react-konva'
import { computeFitTransform } from '@/engine'
import type { ElementChanges, VideoElement } from '@/engine'
import { AUTHORING_GHOST_OPACITY } from '@/renderer/elements/authoring-constants'
import {
  commitTransformFromNode,
  gridPositionFromNode,
} from '@/renderer/elements/element-transform'
import { getVideoElement } from '@/renderer/video/video-playback-store'

const PLACEHOLDER_FILL = '#3f3f46'

function VideoNode({
  element,
  cellSize,
  showAuthoring,
  onSelect,
  onChange,
  onPatch,
  registerNode,
}: {
  element: VideoElement
  cellSize: number
  showAuthoring: boolean
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  onPatch: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}) {
  const transformBaseRef = useRef({ width: element.width, height: element.height })
  const shapeRef = useRef<Konva.Shape | null>(null)

  // Konva doesn't auto-redraw for a texture that changes outside its own
  // props (the video frame updates on its own clock) — nudge it every render,
  // which already happens every rAF tick during playback.
  useEffect(() => {
    shapeRef.current?.getLayer()?.batchDraw()
  })

  if (!showAuthoring) return null

  return (
    <Shape
      ref={(node) => {
        shapeRef.current = node
        registerNode(node)
      }}
      x={element.x * cellSize}
      y={element.y * cellSize}
      width={element.width * cellSize}
      height={element.height * cellSize}
      rotation={element.rotation}
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
        const width = element.width * cellSize
        const height = element.height * cellSize
        const videoEl = getVideoElement(element.id)

        context.save()
        context.globalAlpha = AUTHORING_GHOST_OPACITY * (element.opacity ?? 1)

        if (element.borderRadius > 0) {
          const radius = Math.min(element.borderRadius * cellSize, width / 2, height / 2)
          context.beginPath()
          context.roundRect(0, 0, width, height, radius)
          context.clip()
        }

        if (videoEl && videoEl.readyState >= videoEl.HAVE_CURRENT_DATA && videoEl.videoWidth > 0) {
          const crop = element.crop ?? { x: 0, y: 0, width: 1, height: 1 }
          const cropX = crop.x * videoEl.videoWidth
          const cropY = crop.y * videoEl.videoHeight
          const cropWidth = Math.max(1, crop.width * videoEl.videoWidth)
          const cropHeight = Math.max(1, crop.height * videoEl.videoHeight)

          const { drawWidth, drawHeight, offsetX, offsetY } = computeFitTransform({
            sourceWidth: cropWidth,
            sourceHeight: cropHeight,
            destWidth: width,
            destHeight: height,
            fit: element.fit,
          })

          context.filter = `brightness(${element.brightness})`
          context.drawImage(videoEl, cropX, cropY, cropWidth, cropHeight, offsetX, offsetY, drawWidth, drawHeight)
          context.filter = 'none'
        } else {
          context.fillStyle = PLACEHOLDER_FILL
          context.fillRect(0, 0, width, height)
        }

        context.restore()
        context.fillStrokeShape(shape)
      }}
      hitFunc={(context, shape) => {
        context.beginPath()
        context.rect(0, 0, element.width * cellSize, element.height * cellSize)
        context.fillStrokeShape(shape)
      }}
    />
  )
}

export { VideoNode }
