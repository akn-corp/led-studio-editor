import { listShapeAnimationPresets, type ShapeAnimationPresetId } from '@/engine'
import { cn } from '@/lib/utils'

function ShapeAnimationPresetPicker({
  value,
  onChange,
  loopOnly,
}: {
  value: ShapeAnimationPresetId | null
  onChange: (id: ShapeAnimationPresetId | null) => void
  loopOnly?: boolean
}) {
  const presets = listShapeAnimationPresets({ loopOnly })

  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      <PresetButton label="None" active={value === null} onClick={() => onChange(null)} />
      {presets.map((preset) => (
        <PresetButton
          key={preset.id}
          label={preset.label}
          active={value === preset.id}
          onClick={() => onChange(preset.id)}
        />
      ))}
    </div>
  )
}

function PresetButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex h-16 flex-col items-center justify-center gap-1.5 rounded-lg border text-[10px] transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground',
      )}
    >
      <span className={cn('size-4 rounded-full border-2', active ? 'border-primary' : 'border-muted-foreground/50')} />
      <span className="truncate px-1">{label}</span>
    </button>
  )
}

export { ShapeAnimationPresetPicker }
