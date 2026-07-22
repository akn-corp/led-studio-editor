import { Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function KeyframeToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={active ? 'Remove keyframes for this property' : 'Animate this property'}
      aria-pressed={active}
      onClick={onToggle}
      className={cn(active && 'text-primary')}
    >
      <Timer className={cn(active && 'fill-primary/20')} />
    </Button>
  )
}

export { KeyframeToggle }
