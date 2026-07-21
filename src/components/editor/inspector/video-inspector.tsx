import { useState, type ReactNode } from 'react'
import { ChevronDown, Crop, Palette, Settings2, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimationSpeedControl } from '@/components/editor/inspector/animation-speed-control'
import { KeyframeToggle } from '@/components/editor/inspector/keyframe-toggle'
import { PositionGrid } from '@/components/editor/inspector/position-grid'
import { VideoAnimationPresetPicker } from '@/components/editor/inspector/video-animation-preset-picker'
import { VideoCropOverlay } from '@/components/editor/inspector/video-crop-overlay'
import {
  hasKeyframeTrack,
  type AnimatableProperty,
  type Environment,
  type FitMode,
  type VideoAnimationPresetId,
  type VideoCropRect,
  type VideoElement,
} from '@/engine'
import { roundTo } from '@/lib/utils'

const FIT_OPTIONS: { value: FitMode; label: string }[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'fill', label: 'Fill' },
]

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]

const FULL_FRAME_CROP: VideoCropRect = { x: 0, y: 0, width: 1, height: 1 }

function VideoInspector({
  element,
  baseElement,
  environment,
  writeProperty,
  toggleTrack,
  setNumber,
  updateElement,
  setElementMeta,
  patchElementMeta,
}: {
  element: VideoElement
  baseElement: VideoElement
  environment: Environment
  writeProperty: (property: AnimatableProperty, value: number | string) => void
  toggleTrack: (property: AnimatableProperty, currentValue: number | string) => void
  setNumber: (key: 'rotation' | 'opacity', value: string) => void
  updateElement: (elementId: string, changes: Record<string, unknown>) => void
  setElementMeta: (elementId: string, changes: Record<string, unknown>) => void
  patchElementMeta: (elementId: string, changes: Record<string, unknown>) => void
}) {
  const [showCrop, setShowCrop] = useState(false)
  const crop = element.crop ?? FULL_FRAME_CROP

  return (
    <div className="pointer-events-auto flex h-full w-72 shrink-0 flex-col gap-3 overflow-y-auto border border-border/50 bg-background/70 p-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-muted">
        {element.thumbnailDataUrl && (
          <img src={element.thumbnailDataUrl} alt="" className="size-full object-cover" />
        )}
        {showCrop && (
          <VideoCropOverlay
            crop={crop}
            onPatch={(next) => patchElementMeta(baseElement.id, { crop: next })}
            onCommit={(next) => setElementMeta(baseElement.id, { crop: next })}
          />
        )}
      </div>

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

        <TabsContent value="settings" className="flex flex-col gap-3 pt-1">
          <SectionCard title="Crop">
            <div className="flex items-center justify-between p-3">
              <span className="text-xs text-muted-foreground">Show crop handles on preview</span>
              <Button
                type="button"
                variant={showCrop ? 'default' : 'outline'}
                size="icon-sm"
                aria-pressed={showCrop}
                aria-label="Toggle crop"
                onClick={() => setShowCrop((value) => !value)}
              >
                <Crop />
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Audio">
            <div className="flex flex-col gap-3 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Volume</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={element.muted ? 'Unmute' : 'Mute'}
                  onClick={() => setElementMeta(baseElement.id, { muted: !element.muted })}
                >
                  {element.muted ? <VolumeX /> : <Volume2 />}
                </Button>
              </div>
              <Slider
                value={[element.muted ? 0 : element.volume]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(value) => {
                  const volume = Array.isArray(value) ? value[0] : value
                  setElementMeta(baseElement.id, { volume, muted: volume === 0 })
                }}
              />
            </div>
          </SectionCard>

          <SectionCard title="Playback Speed">
            <div className="p-3">
              <Select
                value={String(element.playbackSpeed)}
                onValueChange={(value) =>
                  setElementMeta(baseElement.id, { playbackSpeed: Number(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPEED_OPTIONS.map((speed) => (
                    <SelectItem key={speed} value={String(speed)}>
                      {speed}x{speed === 1 ? ' (Normal)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SectionCard>

          <AnimationSpeedControl
            value={baseElement.animationSpeed}
            onChange={(speed) => setElementMeta(baseElement.id, { animationSpeed: speed })}
          />

          <VideoAnimationSection
            title="Enter Animations"
            value={baseElement.enterAnimation}
            onChange={(id) => setElementMeta(baseElement.id, { enterAnimation: id })}
            defaultOpen
          />
          <VideoAnimationSection
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
                const width = roundTo(environment.columns * 0.95)
                const height = roundTo(environment.rows * 0.95)
                const x = roundTo((environment.columns - width) / 2)
                const y = roundTo((environment.rows - height) / 2)
                updateElement(baseElement.id, { width, height, x, y })
              }}
            />
          </SectionCard>

          <SectionCard title="Transform">
            <div className="flex flex-col gap-3 p-3">
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

          <SectionCard title="Appearance">
            <div className="flex flex-col gap-3 p-3">
              <FieldRow label="Fit">
                <Select
                  value={element.fit}
                  onValueChange={(value) => setElementMeta(baseElement.id, { fit: value as FitMode })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow label="Filter Preset">
                <Select value="none" disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow label="Border Radius">
                <Slider
                  value={[element.borderRadius]}
                  min={0}
                  max={Math.max(1, Math.min(element.width, element.height) / 2)}
                  step={0.1}
                  onValueChange={(value) =>
                    setElementMeta(baseElement.id, {
                      borderRadius: roundTo(Array.isArray(value) ? value[0] : value),
                    })
                  }
                />
              </FieldRow>

              <FieldRow label="Brightness">
                <Slider
                  value={[element.brightness]}
                  min={0}
                  max={2}
                  step={0.05}
                  onValueChange={(value) =>
                    setElementMeta(baseElement.id, {
                      brightness: roundTo(Array.isArray(value) ? value[0] : value),
                    })
                  }
                />
              </FieldRow>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VideoAnimationSection({
  title,
  value,
  onChange,
  defaultOpen,
}: {
  title: string
  value: VideoAnimationPresetId | null
  onChange: (id: VideoAnimationPresetId | null) => void
  defaultOpen?: boolean
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-xs font-medium hover:bg-muted/50">
        <span>{title}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-b-lg border border-t-0 border-border/50">
        <VideoAnimationPresetPicker value={value} onChange={onChange} />
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

export { VideoInspector }
