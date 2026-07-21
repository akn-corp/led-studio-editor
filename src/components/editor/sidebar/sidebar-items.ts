import {
  Component,
  Grid3x3,
  Lightbulb,
  Music,
  Shapes,
  Sticker,
  Spotlight,
  TvMinimalPlay,
  Type,
  Upload,
} from 'lucide-react'
import { createShapeElement, createTextElement, listShapeKinds } from '@/engine'
import type { Element, Environment } from '@/engine'
import { SHAPE_ICONS } from '@/renderer/shapes/shape-icons'

export interface SidebarSubItem {
  label: string
  icon?: typeof Component
  create?: (environment: Environment, startTime?: number) => Element
  isEnvironment?: boolean
  isAudio?: boolean
  isVideo?: boolean
}

export interface SidebarItem {
  label: string
  icon: typeof Component
  subItems?: SidebarSubItem[]
}

export const sidebarItems: SidebarItem[] = [
  {
    label: 'Elements',
    icon: Component,
    subItems: [
      { label: 'LED Wall', icon: Grid3x3, isEnvironment: true },
      { label: 'Lyre', icon: Lightbulb },
      { label: 'RVBW', icon: Spotlight },
    ],
  },
  {
    label: 'Text',
    icon: Type,
    subItems: [{ label: 'Text', create: createTextElement }],
  },
  {
    label: 'Videos',
    icon: TvMinimalPlay,
    subItems: [{ label: 'Upload Video', icon: Upload, isVideo: true }],
  },
  {
    label: 'Audio',
    icon: Music,
    subItems: [{ label: 'Upload Audio', icon: Upload, isAudio: true }],
  },
  {
    label: 'Shapes',
    icon: Shapes,
    subItems: listShapeKinds().map((shape) => ({
      label: shape.label,
      icon: SHAPE_ICONS[shape.kind],
      create: (environment: Environment, startTime?: number) =>
        createShapeElement(shape.kind, environment, startTime),
    })),
  },
  { label: 'Stickers', icon: Sticker },
]
