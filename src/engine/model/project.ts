import type { AudioTrack } from '@/engine/model/audio'
import type { Environment } from '@/engine/model/environment'
import type { Element } from '@/engine/model/element'

export interface Project {
  id: string
  name: string
  environment: Environment
  elements: Element[]
  audio: AudioTrack | null
}
