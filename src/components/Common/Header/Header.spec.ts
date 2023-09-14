import { mount } from '@vue/test-utils'
import Header from '.'
import { createI18n } from 'vue-i18n'
import { expect, describe, it, beforeEach } from 'vitest'
import {
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { PButton, PIcon, PIAdd } from '@kpmg/styleguide'

const setupI18n = () => {
  return createI18n({
    legacy: false,
    locale: 'en-US',
    messages: {
      'en-US': {
        'bank-mandates': 'Bank mandates',
        'new-mandate': 'New mandate'
      },
      'fr-FR': {
        'bank-mandates': 'Mandats bancaires',
        'new-mandate': 'Nouveau mandat'
      }
    }
  })
}

describe('header.vue', () => {
  let i18n: any

  beforeEach(() => {
    i18n = setupI18n()
  })

  it('renders translations correctly', async () => {
    const wrapper = mount(Header, { global: { plugins: [i18n] } })
    await dynamicUntilFoundComponent(wrapper, PIAdd)
    await dynamicUntilFoundComponent(wrapper, PIcon)
    await dynamicUntilFoundComponent(wrapper, PButton)
    expect(wrapper.find('.header__title').text()).toBe('Banking flows')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('emits click event when button is clicked', async () => {
    const wrapper = mount(Header, { global: { plugins: [i18n] } })
    await dynamicUntilFoundComponent(wrapper, PIAdd)
    await dynamicUntilFoundComponent(wrapper, PIcon)
    await dynamicUntilFoundComponent(wrapper, PButton)
    expect(wrapper.vm.openDrawer).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    expect(wrapper.vm.openDrawer).toBeTruthy()
  })
})
