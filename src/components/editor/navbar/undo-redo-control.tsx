import { Redo2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function UndoRedoControl() {
  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="outline">
              <Undo2 />
              Undo
            </Button>
          }
        />
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Redo" disabled>
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
