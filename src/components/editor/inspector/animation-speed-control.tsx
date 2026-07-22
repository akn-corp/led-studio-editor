import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ANIMATION_SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]

function AnimationSpeedControl({
  value,
  onChange,
}: {
  value: number
  onChange: (speed: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">Animation Speed</Label>
      <Select value={String(value)} onValueChange={(next) => onChange(Number(next))}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ANIMATION_SPEED_OPTIONS.map((speed) => (
            <SelectItem key={speed} value={String(speed)}>
              {speed}x{speed === 1 ? ' (Normal)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { AnimationSpeedControl }
