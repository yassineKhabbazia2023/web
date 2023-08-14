import { mount } from '@vue/test-utils'
import Header from '.'
import { createI18n } from 'vue-i18n'
import { expect, describe, it } from 'vitest'

const i18n = createI18n({
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

describe('Header.vue', () => {
  it('renders translations correctly', () => {
    const wrapper = mount(Header, { global: { plugins: [i18n] } })

    expect(wrapper.find('.header__title').text()).toBe('Bank mandates')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('emits click event when button is clicked', async () => {
    const wrapper = mount(Header, { global: { plugins: [i18n] } })

    await wrapper.find('.header__create-mandate-button').trigger('click')
  })
})

