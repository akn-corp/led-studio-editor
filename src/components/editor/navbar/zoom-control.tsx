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
import { BUTTON_SCALE_STEP, ZOOM_PRESETS } from '@/renderer/constants'
import { useViewport } from '@/state/use-viewport'
import { ChevronDown, ZoomIn, ZoomOut } from 'lucide-react'

function ZoomControl() {
  const { scale, zoomTo, fitToContent } = useViewport()

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Zoom out"
              onClick={() => zoomTo(scale / BUTTON_SCALE_STEP)}
            >
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
              {Math.round(scale * 100)}%
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent
          align="center"
          className="rounded-2xl border border-border/50 bg-background/50 shadow-lg"
        >
          <DropdownMenuItem onClick={() => fitToContent()}>Fit Page</DropdownMenuItem>
          <DropdownMenuSeparator />
          {ZOOM_PRESETS.map((preset) => (
            <DropdownMenuItem key={preset} onClick={() => zoomTo(preset)}>
              {preset * 100}% Zoom
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Zoom in"
              onClick={() => zoomTo(scale * BUTTON_SCALE_STEP)}
            >
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
