import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AnimationSpeedControl } from '@/components/editor/inspector/animation-speed-control'
import { KeyframeToggle } from '@/components/editor/inspector/keyframe-toggle'
import { ShapeAnimationPresetPicker } from '@/components/editor/inspector/shape-animation-preset-picker'
import {
  hasKeyframeTrack,
  listShapeAnimationPresets,
  type AnimatableProperty,
  type Environment,
  type ShapeAnimationPresetId,
  type ShapeElement,
} from '@/engine'

function ShapeInspector({
  element,
  baseElement,
  writeProperty,
  toggleTrack,
  setNumber,
  setElementMeta,
}: {
  element: ShapeElement
  baseElement: ShapeElement
  environment: Environment
  writeProperty: (property: AnimatableProperty, value: number | string) => void
  toggleTrack: (property: AnimatableProperty, currentValue: number | string) => void
  setNumber: (key: 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity', value: string) => void
  updateElement: (elementId: string, changes: Record<string, unknown>) => void
  setElementMeta: (elementId: string, changes: Record<string, unknown>) => void
}) {
  return (
    <div className="pointer-events-auto flex h-full w-72 shrink-0 flex-col gap-4 overflow-y-auto border border-border/50 bg-background/70 p-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <h2 className="text-sm font-semibold capitalize">{element.shapeKind}</h2>

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

      <div className="flex flex-col gap-2">
        <AnimationSpeedControl
          value={baseElement.animationSpeed}
          onChange={(speed) => setElementMeta(baseElement.id, { animationSpeed: speed })}
        />
        <AnimationSection
          title="Enter Animations"
          value={baseElement.enterAnimation}
          onChange={(id) => setElementMeta(baseElement.id, { enterAnimation: id })}
          defaultOpen
        />
        <AnimationSection
          title="Loop Animations"
          value={baseElement.loopAnimation}
          onChange={(id) => setElementMeta(baseElement.id, { loopAnimation: id })}
          loopOnly
        />
        <AnimationSection
          title="Exit Animations"
          value={baseElement.exitAnimation}
          onChange={(id) => setElementMeta(baseElement.id, { exitAnimation: id })}
        />
      </div>
    </div>
  )
}

function AnimationSection({
  title,
  value,
  onChange,
  loopOnly,
  defaultOpen,
}: {
  title: string
  value: ShapeAnimationPresetId | null
  onChange: (id: ShapeAnimationPresetId | null) => void
  loopOnly?: boolean
  defaultOpen?: boolean
}) {
  const count = listShapeAnimationPresets({ loopOnly }).length

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-xs font-medium hover:bg-muted/50">
        <span>
          {title} <span className="text-muted-foreground">({count})</span>
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-b-lg border border-t-0 border-border/50">
        <ShapeAnimationPresetPicker value={value} onChange={onChange} loopOnly={loopOnly} />
      </CollapsibleContent>
    </Collapsible>
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

export { ShapeInspector }
