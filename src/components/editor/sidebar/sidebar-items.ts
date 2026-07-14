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
import { createSquareElement, createTextElement } from '@/engine'
import type { Element, Environment } from '@/engine'

export interface SidebarSubItem {
  label: string
  icon?: typeof Component
  create?: (environment: Environment) => Element
  isEnvironment?: boolean
  isAudio?: boolean
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
  { label: 'Videos', icon: TvMinimalPlay },
  {
    label: 'Audio',
    icon: Music,
    subItems: [{ label: 'Upload Audio', icon: Upload, isAudio: true }],
  },
  {
    label: 'Shapes',
    icon: Shapes,
    subItems: [{ label: 'Square', create: createSquareElement }],
  },
  { label: 'Stickers', icon: Sticker },
]
