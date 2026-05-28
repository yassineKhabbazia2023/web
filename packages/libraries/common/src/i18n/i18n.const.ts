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
    longText: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
    longText: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  },
} as Record<string, DefineDateTimeFormat>
