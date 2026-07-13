import { LayoutGrid, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { DisplayMode } from '@/state/use-display-mode'
import { useDisplayMode } from '@/state/use-display-mode'

const MODES: { id: DisplayMode; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'edit', label: 'Edit', icon: LayoutGrid },
  { id: 'simulation', label: 'Realistic Simulation', icon: Sparkles },
]

function DisplayModeToolbar() {
  const { mode, setMode } = useDisplayMode()

  return (
    <div className="pointer-events-auto absolute top-15 left-1/2 z-10 -translate-x-1/2">
      <ButtonGroup className="rounded-lg border border-border/50 bg-background/90 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
        {MODES.map(({ id, label, icon: Icon }) => (
          <Tooltip key={id}>
            <TooltipTrigger
              render={
                <Button
                  variant={mode === id ? 'default' : 'ghost'}
                  size="icon"
                  aria-label={label}
                  aria-pressed={mode === id}
                  onClick={() => setMode(id)}
                >
                  <Icon />
                </Button>
              }
            />
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </ButtonGroup>
    </div>
  )
}

export { DisplayModeToolbar }
