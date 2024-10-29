import { setAssetsBaseUrl } from '@pulse/styleguide'
import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

config.global.plugins = [i18n]

setAssetsBaseUrl('https://www.example.pulse')
