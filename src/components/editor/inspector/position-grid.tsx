import { Button } from '@/components/ui/button'
import type { Environment } from '@/engine'
import { roundTo } from '@/lib/utils'

type XAnchor = 'left' | 'center' | 'right'
type YAnchor = 'top' | 'middle' | 'bottom'

const ANCHORS: { x: XAnchor; y: YAnchor }[] = [
  { x: 'left', y: 'top' },
  { x: 'center', y: 'top' },
  { x: 'right', y: 'top' },
  { x: 'left', y: 'middle' },
  { x: 'center', y: 'middle' },
  { x: 'right', y: 'middle' },
  { x: 'left', y: 'bottom' },
  { x: 'center', y: 'bottom' },
  { x: 'right', y: 'bottom' },
]

function anchorPosition(
  anchor: { x: XAnchor; y: YAnchor },
  width: number,
  height: number,
  environment: Environment,
) {
  const x =
    anchor.x === 'left' ? 0 : anchor.x === 'right' ? environment.columns - width : (environment.columns - width) / 2
  const y =
    anchor.y === 'top' ? 0 : anchor.y === 'bottom' ? environment.rows - height : (environment.rows - height) / 2
  return { x: roundTo(x), y: roundTo(y) }
}

function PositionGrid({
  width,
  height,
  environment,
  onSetPosition,
  onFillCanvas,
}: {
  width: number
  height: number
  environment: Environment
  onSetPosition: (position: { x: number; y: number }) => void
  onFillCanvas: () => void
}) {
  return (
    <div className="space-y-2 p-3">
      <div className="grid grid-cols-3 gap-1.5">
        {ANCHORS.map((anchor) => (
          <button
            key={`${anchor.x}-${anchor.y}`}
            type="button"
            aria-label={`Align ${anchor.y} ${anchor.x}`}
            className="flex h-8 items-center justify-center rounded-md border border-border/50 hover:border-primary hover:text-primary"
            onClick={() => onSetPosition(anchorPosition(anchor, width, height, environment))}
          >
            <span className="size-1.5 rounded-full bg-current" />
          </button>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={onFillCanvas}>
        Fill Canvas
      </Button>
    </div>
  )
}

export { PositionGrid }
