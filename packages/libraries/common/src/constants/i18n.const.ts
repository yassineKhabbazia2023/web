import type { DefineDateTimeFormat } from 'vue-i18n'

export const DATE_TIME_FORMATS = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    shortDate: {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  'fr-FR': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    shortDate: {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
  },
} as Record<string, DefineDateTimeFormat>
