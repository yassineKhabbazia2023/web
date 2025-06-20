import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'fr-FR', // langue par défaut
  allowComposition: true,
  legacy: false,
  // we silent the warnings for missing translations
  // because the mix of <i18n> in SFC and i18n.t() in TS can lead to false positives
  // known bug, solution: upgrade version of vue-i18n
  fallbackWarn: false,
  missingWarn: false,
})

export { i18n }
