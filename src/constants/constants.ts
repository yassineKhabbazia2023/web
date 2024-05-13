import type { DefineDateTimeFormat } from 'vue-i18n'

export const DATE_TIME_FORMATS = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  },
  'fr-FR': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  },
} as Record<string, DefineDateTimeFormat>

export const PAGE_SIZES = [15, 30, 45, 60]

export const PERMISSION_CODES = {
  MANDATE: 'COMAND001',
  SUBSCRIPTIONS: 'COOFF002',
  COLLABORATORS: 'COADMI001',
  HISTORY: 'COGES001',
  POWERBI_REPORT: 'CORAP001',
  USERS: 'CLUSER001',
}
