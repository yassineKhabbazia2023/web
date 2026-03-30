// Application Information
export const APP_COPYRIGHT = '© 2026 RYDGE Conseil. Tous droits réservés.'

// Pagination Configuration
export const DEFAULT_PAGE_SIZE = 25
export const DEFAULT_PAGE_NUMBER = 1
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

// Environment Names
export const ENVIRONMENTS = {
  DEV: 'DEV',
  ITG: 'ITG',
  REC: 'REC',
  PPR: 'PPR',
  PRD: 'PRD',
}

export const ENVIRONMENT_LABELS = {
  [ENVIRONMENTS.DEV]: 'Développement',
  [ENVIRONMENTS.ITG]: 'ITG',
  [ENVIRONMENTS.REC]: 'REC',
  [ENVIRONMENTS.PPR]: 'PPR',
  [ENVIRONMENTS.PRD]: 'PRD',
}

export const AVAILABLE_ENVIRONMENTS = Object.values(ENVIRONMENTS)

export type Environment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS]
