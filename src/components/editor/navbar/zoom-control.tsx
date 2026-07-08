import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronDown, ZoomIn, ZoomOut } from 'lucide-react'

function ZoomControl() {
  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Zoom out">
              <ZoomOut />
            </Button>
          }
        />
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline">
              50%
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent align="center">
          <DropdownMenuItem>Auto-Fit Page</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Fit Page</DropdownMenuItem>
          <DropdownMenuItem disabled>Fit Selection</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>200% Zoom</DropdownMenuItem>
          <DropdownMenuItem>100% Zoom</DropdownMenuItem>
          <DropdownMenuItem>50% Zoom</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Zoom in">
              <ZoomIn />
            </Button>
          }
        />
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  )
}

export { ZoomControl }
