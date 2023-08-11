import { describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import wrapperFactory from 'tests/utils/wrapperFactory'
import Home from './'

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props
  })

describe('home component', () => {
  it('displays mandate message correctly for en-US', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en-US',
      messages: {
        'en-US': {
          mandate: 'Mandate'
        }
      }
    })

    const wrapper = createWrapper({
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('Mandate')
  })

  it('displays mandate message correctly for fr-FR', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'fr-FR',
      messages: {
        'fr-FR': {
          mandate: 'Mandat'
        }
      }
    })

    const wrapper = createWrapper({
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('Mandat')
  })
})
