import type { ReactNode } from 'react'
import { hasKeyframeTrack, resolveElementAtTime, type AnimatableProperty } from '@/engine'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyframeToggle } from '@/components/editor/inspector/keyframe-toggle'
import { TextInspector } from '@/components/editor/inspector/text-inspector'
import { VideoInspector } from '@/components/editor/inspector/video-inspector'
import { roundTo } from '@/lib/utils'
import { usePlayback } from '@/state/use-playback'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'

function EditorInspector() {
  const { project, updateElement, addKeyframe, clearKeyframeTrack, setElementMeta, patchElementMeta } =
    useScene()
  const { selectedElementId } = useSelection()
  const { currentTime } = usePlayback()
  const baseElement = project.elements.find((candidate) => candidate.id === selectedElementId)

  if (!baseElement) return null

  const element = resolveElementAtTime(baseElement, currentTime)

  const writeProperty = (property: AnimatableProperty, value: number | string) => {
    if (hasKeyframeTrack(baseElement, property)) {
      addKeyframe(baseElement.id, property, currentTime, value)
    } else {
      updateElement(baseElement.id, { [property]: value })
    }
  }

  const toggleTrack = (property: AnimatableProperty, currentValue: number | string) => {
    if (hasKeyframeTrack(baseElement, property)) {
      clearKeyframeTrack(baseElement.id, property)
    } else {
      addKeyframe(baseElement.id, property, currentTime, currentValue)
    }
  }

  const setNumber = (
    key: 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity' | 'fontSize',
    value: string,
  ) => {
    const parsed = Number.parseFloat(value)
    if (Number.isNaN(parsed)) return
    writeProperty(key, roundTo(parsed))
  }

  // element is derived from baseElement via resolveElementAtTime, which always
  // preserves `.type` — narrowing on baseElement first, then element with its
  // own guard, lets TS narrow both without a compound (&&) condition, which it
  // can't carry past the block.
  if (baseElement.type === 'text') {
    if (element.type !== 'text') return null
    return (
      <TextInspector
        element={element}
        baseElement={baseElement}
        environment={project.environment}
        writeProperty={writeProperty}
        toggleTrack={toggleTrack}
        setNumber={setNumber}
        updateElement={updateElement}
        setElementMeta={setElementMeta}
      />
    )
  }

  if (baseElement.type === 'video') {
    if (element.type !== 'video') return null
    return (
      <VideoInspector
        element={element}
        baseElement={baseElement}
        environment={project.environment}
        writeProperty={writeProperty}
        toggleTrack={toggleTrack}
        setNumber={setNumber}
        updateElement={updateElement}
        setElementMeta={setElementMeta}
        patchElementMeta={patchElementMeta}
      />
    )
  }

  // Only Square is left at this point (baseElement.type narrowed by elimination).
  if (element.type !== 'square') return null

  return (
    <div className="pointer-events-auto flex h-full w-72 shrink-0 flex-col gap-4 overflow-y-auto border border-border/50 bg-background/70 p-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <h2 className="text-sm font-semibold capitalize">{element.type}</h2>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="X"
          isTracked={hasKeyframeTrack(baseElement, 'x')}
          onToggle={() => toggleTrack('x', element.x)}
        >
          <Input type="number" value={element.x} onChange={(e) => setNumber('x', e.target.value)} />
        </Field>
        <Field
          label="Y"
          isTracked={hasKeyframeTrack(baseElement, 'y')}
          onToggle={() => toggleTrack('y', element.y)}
        >
          <Input type="number" value={element.y} onChange={(e) => setNumber('y', e.target.value)} />
        </Field>
        <Field
          label="Width"
          isTracked={hasKeyframeTrack(baseElement, 'width')}
          onToggle={() => toggleTrack('width', element.width)}
        >
          <Input
            type="number"
            value={element.width}
            onChange={(e) => setNumber('width', e.target.value)}
          />
        </Field>
        <Field
          label="Height"
          isTracked={hasKeyframeTrack(baseElement, 'height')}
          onToggle={() => toggleTrack('height', element.height)}
        >
          <Input
            type="number"
            value={element.height}
            onChange={(e) => setNumber('height', e.target.value)}
          />
        </Field>
        <Field
          label="Rotation"
          isTracked={hasKeyframeTrack(baseElement, 'rotation')}
          onToggle={() => toggleTrack('rotation', element.rotation)}
        >
          <Input
            type="number"
            value={element.rotation}
            onChange={(e) => setNumber('rotation', e.target.value)}
          />
        </Field>
        <Field
          label="Opacity"
          isTracked={hasKeyframeTrack(baseElement, 'opacity')}
          onToggle={() => toggleTrack('opacity', element.opacity)}
        >
          <Input
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={element.opacity}
            onChange={(e) => setNumber('opacity', e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Fill"
        isTracked={hasKeyframeTrack(baseElement, 'fill')}
        onToggle={() => toggleTrack('fill', element.fill)}
      >
        <Input
          type="color"
          value={element.fill}
          onChange={(e) => writeProperty('fill', e.target.value)}
          className="h-8 w-full p-1"
        />
      </Field>
    </div>
  )
}

function Field({
  label,
  children,
  isTracked,
  onToggle,
}: {
  label: string
  children: ReactNode
  isTracked?: boolean
  onToggle?: () => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {onToggle && <KeyframeToggle active={!!isTracked} onToggle={onToggle} />}
      </div>
      {children}
    </div>
  )
}

export { EditorInspector }
