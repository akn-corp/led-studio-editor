import type { Environment } from '@/engine/model/environment'

export interface Project {
  id: string
  name: string
  environment: Environment
}
