import { setupVitest } from '../../@config/vitest.setup.base'
import frFR from './src/i18n/fr-FR.json'
import enUS from './src/i18n/en-US.json'

setupVitest({
  i18nMessages: {
    'fr-FR': frFR,
    'en-US': enUS,
  },
})
