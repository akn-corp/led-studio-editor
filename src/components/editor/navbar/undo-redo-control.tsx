import { Redo2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useScene } from '@/state/use-scene'

function UndoRedoControl() {
  const { undo, redo, canUndo, canRedo } = useScene()

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Undo"
              disabled={!canUndo}
              onClick={undo}
            >
              <Undo2 />
            </Button>
          }
        />
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Redo"
              disabled={!canRedo}
              onClick={redo}
            >
              <Redo2 />
            </Button>
          }
        />
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  )
}

export { UndoRedoControl }
