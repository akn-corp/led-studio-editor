import { useState } from 'react'
import { Square, Type, Video } from 'lucide-react'
import type { Element } from '@/engine'
import { cn } from '@/lib/utils'
import { useScene } from '@/state/use-scene'

const MIN_CLIP_DURATION = 0.2
const SNAP_THRESHOLD_PX = 8

const ELEMENT_ICON = { square: Square, text: Type, video: Video } as const

function clipLabel(element: Element): string {
  if (element.type === 'text') return element.text
  if (element.type === 'video') return element.fileName
  return 'Square'
}

interface DragState {
  mode: 'move' | 'trim-start' | 'trim-end'
  pointerStartClientX: number
  /** Fixed at drag-start — deltas are always computed against these, never against the live values below. */
  originStartTime: number
  originDuration: number
  startTime: number
  duration: number
}

function snapToCandidates(time: number, candidates: number[], thresholdSeconds: number): number {
  let closest = time
  let closestDistance = thresholdSeconds
  for (const candidate of candidates) {
    const distance = Math.abs(candidate - time)
    if (distance <= closestDistance) {
      closest = candidate
      closestDistance = distance
    }
  }
  return closest
}

function TimelineClip({
  element,
  otherElements,
  pixelsPerSecond,
  currentTime,
  isSelected,
  onSelect,
}: {
  element: Element
  otherElements: Element[]
  pixelsPerSecond: number
  currentTime: number
  isSelected: boolean
  onSelect: () => void
}) {
  const { setElementMeta, patchElementMeta } = useScene()
  const [drag, setDrag] = useState<DragState | null>(null)

  const startTime = drag ? drag.startTime : element.startTime
  const duration = drag ? drag.duration : element.duration
  const Icon = ELEMENT_ICON[element.type]

  const snapCandidates = [0, currentTime]
  for (const other of otherElements) {
    if (other.id === element.id) continue
    snapCandidates.push(other.startTime, other.startTime + other.duration)
  }
  const snapThreshold = SNAP_THRESHOLD_PX / pixelsPerSecond

  const beginDrag = (mode: DragState['mode'], e: React.PointerEvent) => {
    e.stopPropagation()
    onSelect()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({
      mode,
      pointerStartClientX: e.clientX,
      originStartTime: element.startTime,
      originDuration: element.duration,
      startTime: element.startTime,
      duration: element.duration,
    })
  }

  const onDragMove = (e: React.PointerEvent) => {
    const base = drag
    if (!base || e.buttons !== 1) return
    const deltaTime = (e.clientX - base.pointerStartClientX) / pixelsPerSecond

    let next: DragState
    if (base.mode === 'move') {
      const rawStart = Math.max(0, base.originStartTime + deltaTime)
      const snappedStart = snapToCandidates(rawStart, snapCandidates, snapThreshold)
      next = { ...base, startTime: snappedStart }
    } else if (base.mode === 'trim-start') {
      const rawStart = Math.max(0, base.originStartTime + deltaTime)
      const snappedStart = snapToCandidates(rawStart, snapCandidates, snapThreshold)
      const clampedStart = Math.min(
        snappedStart,
        base.originStartTime + base.originDuration - MIN_CLIP_DURATION,
      )
      const newDuration = base.originStartTime + base.originDuration - clampedStart
      next = { ...base, startTime: clampedStart, duration: newDuration }
    } else {
      const rawEnd = base.originStartTime + base.originDuration + deltaTime
      const snappedEnd = snapToCandidates(rawEnd, snapCandidates, snapThreshold)
      const newDuration = Math.max(MIN_CLIP_DURATION, snappedEnd - base.originStartTime)
      next = { ...base, duration: newDuration }
    }

    setDrag(next)
    patchElementMeta(element.id, { startTime: next.startTime, duration: next.duration })
  }

  const commitDrag = () => {
    const final = drag
    setDrag(null)
    if (!final) return
    setElementMeta(element.id, { startTime: final.startTime, duration: final.duration })
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${element.type} clip`}
      className={cn(
        'absolute inset-y-1 flex cursor-grab items-center gap-1 rounded-md border px-1.5 text-xs text-white select-none active:cursor-grabbing',
        element.type === 'text' && 'border-blue-400/50 bg-blue-500/80',
        element.type === 'square' && 'border-indigo-400/50 bg-indigo-500/80',
        element.type === 'video' && 'border-emerald-400/50 bg-emerald-500/80',
        isSelected && 'ring-2 ring-white',
      )}
      style={{ left: startTime * pixelsPerSecond, width: Math.max(duration * pixelsPerSecond, 4) }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onPointerDown={(e) => beginDrag('move', e)}
      onPointerMove={onDragMove}
      onPointerUp={commitDrag}
    >
      <div
        className="absolute inset-y-0 left-0 w-1.5 cursor-ew-resize"
        onPointerDown={(e) => beginDrag('trim-start', e)}
        onPointerMove={onDragMove}
        onPointerUp={commitDrag}
      />
      <Icon className="size-3 shrink-0" />
      <span className="truncate">{clipLabel(element)}</span>
      <div
        className="absolute inset-y-0 right-0 w-1.5 cursor-ew-resize"
        onPointerDown={(e) => beginDrag('trim-end', e)}
        onPointerMove={onDragMove}
        onPointerUp={commitDrag}
      />
    </div>
  )
}

export { TimelineClip }
