import type { DefineDateTimeFormat } from 'vue-i18n'

export const datetimeFormats = {
  'en-US': {
    longDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
  },
  'fr-FR': {
    longDate: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
  },
} as Record<string, DefineDateTimeFormat>

export const TEMPLATE_TYPE_SHORT_OTHER = 'autre'
