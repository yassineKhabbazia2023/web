import type { DefineDateTimeFormat } from 'vue-i18n'

// TODO remplacer la même constante dans entities par celle-ci dans common
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
  },
} as Record<string, DefineDateTimeFormat>
