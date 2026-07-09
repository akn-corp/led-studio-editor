export interface Environment {
  rows: number
  columns: number
}

export const DEFAULT_ENVIRONMENT: Environment = {
  rows: 8,
  columns: 8,
}

export const ENVIRONMENT_LIMITS = {
  min: 1,
  max: 256,
} as const
