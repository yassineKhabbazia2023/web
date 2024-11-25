import styleguideLibrary from '@pulse/styleguide'

import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

const styleguideParameters = {
  assetsBaseUrl: 'https://www.example.pulse',
}
config.global.plugins = [
  i18n,
  [styleguideLibrary, styleguideParameters],
]
