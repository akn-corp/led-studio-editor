import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { LABEL_WIDTH } from '@/components/editor/timeline/timeline-scale'

function TimelineLaneRow({
  label,
  trackWidth,
  className,
  laneClassName,
  onLabelClick,
  children,
}: {
  label: ReactNode
  trackWidth: number
  className?: string
  laneClassName?: string
  onLabelClick?: () => void
  children: ReactNode
}) {
  return (
    <div
      className={cn('relative flex h-10 shrink-0 items-center border-b border-border/30', className)}
      style={{ width: trackWidth }}
    >
      <div
        onClick={onLabelClick}
        className={cn(
          'flex h-full shrink-0 items-center gap-1.5 truncate px-2 text-xs text-muted-foreground',
          onLabelClick && 'cursor-pointer hover:text-foreground',
        )}
        style={{ width: LABEL_WIDTH }}
      >
        {label}
      </div>
      <div className={cn('relative h-full flex-1', laneClassName)}>{children}</div>
    </div>
  )
}

export { TimelineLaneRow }
