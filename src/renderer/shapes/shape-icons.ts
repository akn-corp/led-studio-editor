import { Circle, Hexagon, Pentagon, Square, Star, Triangle, X } from 'lucide-react'
import type { ShapeKind } from '@/engine'

// Kept out of the engine layer (which never imports React) — this is the
// one place that maps a shape kind to its icon, reused by the sidebar,
// timeline clip, and track row.
export const SHAPE_ICONS: Record<ShapeKind, typeof Square> = {
  square: Square,
  circle: Circle,
  triangle: Triangle,
  star: Star,
  cross: X,
  pentagon: Pentagon,
  hexagon: Hexagon,
}
