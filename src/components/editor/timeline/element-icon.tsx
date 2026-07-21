import { Type, Video } from 'lucide-react'
import type { Element } from '@/engine'
import { SHAPE_ICONS } from '@/renderer/shapes/shape-icons'

function ElementIcon({ element, className }: { element: Element; className?: string }) {
  if (element.type === 'shape') {
    const Icon = SHAPE_ICONS[element.shapeKind]
    return <Icon className={className} />
  }
  if (element.type === 'text') return <Type className={className} />
  return <Video className={className} />
}

export { ElementIcon }
