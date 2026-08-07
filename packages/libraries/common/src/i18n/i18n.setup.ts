import { createI18n } from 'vue-i18n'
import { DATE_TIME_FORMATS } from './i18n.const'

const i18n = createI18n({
  locale: 'fr-FR', // langue par défaut
  allowComposition: true,
  legacy: false,
  // Registered globally so components on the global scope can call d(date, 'short') as is.
  datetimeFormats: DATE_TIME_FORMATS,
  // we silent the warnings for missing translations
  // because the mix of <i18n> in SFC and i18n.t() in TS can lead to false positives
  fallbackWarn: false,
  missingWarn: false,
})

export { i18n }
