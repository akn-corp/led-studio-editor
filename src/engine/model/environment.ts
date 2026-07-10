export interface Environment {
  rows: number
  columns: number
  isSetted: boolean
}

export const DEFAULT_ENVIRONMENT: Environment = {
  rows: 128,
  columns: 128,
  isSetted: false,
}

export const ENVIRONMENT_LIMITS = {
  min: 1,
  max: 256,
} as const
