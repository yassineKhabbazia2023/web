import styleguideLibrary from '@pulse/styleguide'
import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
})

const styleguideParameters = {
  assetsBaseUrl: 'https://www.example.test',
}
config.global.plugins = [
  i18n,
  [styleguideLibrary, styleguideParameters],
]
