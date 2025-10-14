import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import frFR from './src/i18n/fr-FR.json'
import enUS from './src/i18n/en-US.json'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages: {
    'fr-FR': frFR,
    'en-US': enUS,
  },
})

config.global.plugins = [
  i18n,
]
