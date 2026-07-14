import type { ReactNode } from 'react'
import { ChevronDown, Palette, Settings2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AnimationPresetPicker } from '@/components/editor/inspector/animation-preset-picker'
import { KeyframeToggle } from '@/components/editor/inspector/keyframe-toggle'
import { PositionGrid } from '@/components/editor/inspector/position-grid'
import {
  hasKeyframeTrack,
  listAnimationPresets,
  type AnimatableProperty,
  type AnimationPresetId,
  type Environment,
  type TextElement,
} from '@/engine'
import { roundTo } from '@/lib/utils'

const FILL_RATIO = 0.9

function TextInspector({
  element,
  baseElement,
  environment,
  writeProperty,
  toggleTrack,
  setNumber,
  updateElement,
  setElementMeta,
}: {
  element: TextElement
  baseElement: TextElement
  environment: Environment
  writeProperty: (property: AnimatableProperty, value: number | string) => void
  toggleTrack: (property: AnimatableProperty, currentValue: number | string) => void
  setNumber: (key: 'rotation' | 'opacity' | 'fontSize', value: string) => void
  updateElement: (elementId: string, changes: Record<string, unknown>) => void
  setElementMeta: (elementId: string, changes: Record<string, unknown>) => void
}) {
  return (
    <div className="pointer-events-auto flex h-full w-72 shrink-0 flex-col gap-3 overflow-y-auto border border-border/50 bg-background/70 p-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <Textarea
        value={element.text}
        rows={2}
        onChange={(e) => updateElement(baseElement.id, { text: e.target.value })}
      />

      <Tabs defaultValue="settings">
        <TabsList className="w-full">
          <TabsTrigger value="settings">
            <Settings2 />
            Settings
          </TabsTrigger>
          <TabsTrigger value="style">
            <Palette />
            Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="flex flex-col gap-2 pt-1">
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
        </TabsContent>

        <TabsContent value="style" className="flex flex-col gap-3 pt-1">
          <SectionCard title="Position">
            <PositionGrid
              width={element.width}
              height={element.height}
              environment={environment}
              onSetPosition={(position) => {
                writeProperty('x', position.x)
                writeProperty('y', position.y)
              }}
              onFillCanvas={() => {
                const width = roundTo(environment.columns * FILL_RATIO)
                const x = roundTo((environment.columns - width) / 2)
                updateElement(baseElement.id, { width, x })
              }}
            />
          </SectionCard>

          <SectionCard title="Transform">
            <div className="flex flex-col gap-3 p-3">
              <FieldRow
                label="Font Size"
                isTracked={hasKeyframeTrack(baseElement, 'fontSize')}
                onToggle={() => toggleTrack('fontSize', element.fontSize)}
              >
                <Slider
                  value={[element.fontSize]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) =>
                    writeProperty('fontSize', roundTo(Array.isArray(value) ? value[0] : value))
                  }
                />
              </FieldRow>
              <FieldRow
                label="Rotation"
                isTracked={hasKeyframeTrack(baseElement, 'rotation')}
                onToggle={() => toggleTrack('rotation', element.rotation)}
              >
                <Input
                  type="number"
                  value={element.rotation}
                  onChange={(e) => setNumber('rotation', e.target.value)}
                />
              </FieldRow>
              <FieldRow
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
              </FieldRow>
            </div>
          </SectionCard>

          <SectionCard title="Colors">
            <div className="grid grid-cols-2 gap-3 p-3">
              <FieldRow
                label="Text Color"
                isTracked={hasKeyframeTrack(baseElement, 'fill')}
                onToggle={() => toggleTrack('fill', element.fill)}
              >
                <Input
                  type="color"
                  value={element.fill}
                  onChange={(e) => writeProperty('fill', e.target.value)}
                  className="h-8 w-full p-1"
                />
              </FieldRow>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Background</Label>
                  {element.backgroundColor && (
                    <button
                      type="button"
                      className="text-[10px] text-muted-foreground hover:text-foreground"
                      onClick={() => setElementMeta(baseElement.id, { backgroundColor: null })}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <Input
                  type="color"
                  value={element.backgroundColor ?? '#000000'}
                  onChange={(e) =>
                    setElementMeta(baseElement.id, { backgroundColor: e.target.value })
                  }
                  className="h-8 w-full p-1"
                />
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
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
  value: AnimationPresetId | null
  onChange: (id: AnimationPresetId | null) => void
  loopOnly?: boolean
  defaultOpen?: boolean
}) {
  const count = listAnimationPresets({ loopOnly }).length

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-xs font-medium hover:bg-muted/50">
        <span>
          {title} <span className="text-muted-foreground">({count})</span>
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-b-lg border border-t-0 border-border/50">
        <AnimationPresetPicker value={value} onChange={onChange} loopOnly={loopOnly} />
      </CollapsibleContent>
    </Collapsible>
  )
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border/50">
      <div className="border-b border-border/50 px-3 py-2 text-xs font-medium">{title}</div>
      {children}
    </div>
  )
}

function FieldRow({
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

export { TextInspector }
