import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { roundTo } from '@/lib/utils'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'

function EditorInspector() {
  const { project, updateElement } = useScene()
  const { selectedElementId } = useSelection()
  const element = project.elements.find((candidate) => candidate.id === selectedElementId)

  if (!element) return null

  const setNumber = (
    key: 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity' | 'fontSize',
    value: string,
  ) => {
    const parsed = Number.parseFloat(value)
    if (Number.isNaN(parsed)) return
    updateElement(element.id, { [key]: roundTo(parsed) })
  }

  return (
    <div className="pointer-events-auto flex h-full w-72 shrink-0 flex-col gap-4 overflow-y-auto border border-border/50 bg-background/70 p-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <h2 className="text-sm font-semibold capitalize">{element.type}</h2>

      <div className="grid grid-cols-2 gap-3">
        <Field label="X">
          <Input type="number" value={element.x} onChange={(e) => setNumber('x', e.target.value)} />
        </Field>
        <Field label="Y">
          <Input type="number" value={element.y} onChange={(e) => setNumber('y', e.target.value)} />
        </Field>
        <Field label="Width">
          <Input
            type="number"
            value={element.width}
            onChange={(e) => setNumber('width', e.target.value)}
          />
        </Field>
        <Field label="Height">
          <Input
            type="number"
            value={element.height}
            onChange={(e) => setNumber('height', e.target.value)}
          />
        </Field>
        <Field label="Rotation">
          <Input
            type="number"
            value={element.rotation}
            onChange={(e) => setNumber('rotation', e.target.value)}
          />
        </Field>
        <Field label="Opacity">
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

      <Field label="Fill">
        <Input
          type="color"
          value={element.fill}
          onChange={(e) => updateElement(element.id, { fill: e.target.value })}
          className="h-8 w-full p-1"
        />
      </Field>

      {element.type === 'text' && (
        <>
          <Field label="Text">
            <Input
              value={element.text}
              onChange={(e) => updateElement(element.id, { text: e.target.value })}
            />
          </Field>
          <Field label="Font size">
            <Input
              type="number"
              value={element.fontSize}
              onChange={(e) => setNumber('fontSize', e.target.value)}
            />
          </Field>
        </>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

export { EditorInspector }
