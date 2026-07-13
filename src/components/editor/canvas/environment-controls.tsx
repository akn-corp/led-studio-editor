import type { ChangeEvent, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { ENVIRONMENT_LIMITS } from '@/engine'
import { clamp } from '@/lib/utils'
import { useScene } from '@/state/use-scene'

const BLOCKED_KEYS = ['.', '-', '+', 'e', 'E']

function EnvironmentControls() {
  const { environment, setEnvironment } = useScene()

  const blockNonIntegerKeys = (e: KeyboardEvent<HTMLInputElement>) => {
    if (BLOCKED_KEYS.includes(e.key)) {
      e.preventDefault()
    }
  }

  const handleRowsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number.parseInt(e.target.value, 10)
    if (Number.isNaN(parsed)) return
    setEnvironment({ rows: clamp(parsed, ENVIRONMENT_LIMITS.min, ENVIRONMENT_LIMITS.max) })
  }

  const handleColumnsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number.parseInt(e.target.value, 10)
    if (Number.isNaN(parsed)) return
    setEnvironment({ columns: clamp(parsed, ENVIRONMENT_LIMITS.min, ENVIRONMENT_LIMITS.max) })
  }

  return (
    <div className="absolute top-24 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-border/50 bg-background/60 px-3 py-2 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">Rows</span>
        <Input
          type="number"
          inputMode="numeric"
          min={ENVIRONMENT_LIMITS.min}
          max={ENVIRONMENT_LIMITS.max}
          step={1}
          value={environment.rows}
          onKeyDown={blockNonIntegerKeys}
          onChange={handleRowsChange}
          className="h-7 w-14 px-2 text-center"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">Columns</span>
        <Input
          type="number"
          inputMode="numeric"
          min={ENVIRONMENT_LIMITS.min}
          max={ENVIRONMENT_LIMITS.max}
          step={1}
          value={environment.columns}
          onKeyDown={blockNonIntegerKeys}
          onChange={handleColumnsChange}
          className="h-7 w-14 px-2 text-center"
        />
      </div>
    </div>
  )
}

export { EnvironmentControls }
