import { Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useDisplayMode } from '@/state/use-display-mode'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'
import { useSelectionRect } from '@/state/use-selection-rect'

const TOOLBAR_GAP = 12

function ElementActionToolbar() {
  const rect = useSelectionRect()
  const { mode } = useDisplayMode()
  const { selectedElementId, select } = useSelection()
  const { duplicateElement, removeElement } = useScene()

  if (mode !== 'edit' || !rect || !selectedElementId) return null

  const handleDuplicate = () => {
    const newId = duplicateElement(selectedElementId)
    if (newId) select(newId)
  }

  const handleDelete = () => {
    removeElement(selectedElementId)
    select(null)
  }

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-full"
      style={{ left: rect.x + rect.width / 2, top: rect.y - TOOLBAR_GAP }}
    >
      <ButtonGroup className="rounded-lg border border-border/50 bg-background/90 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Duplicate" onClick={handleDuplicate}>
                <Copy />
              </Button>
            }
          />
          <TooltipContent>Duplicate</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Delete" onClick={handleDelete}>
                <Trash2 />
              </Button>
            }
          />
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </div>
  )
}

export { ElementActionToolbar }
