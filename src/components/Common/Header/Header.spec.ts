import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import Header from '.'
import { createI18n } from 'vue-i18n'
import { expect, describe, it, vi, beforeEach } from 'vitest'

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

const waitForAsyncOperations = async () => {
  await flushPromises()
  for (let i = 0; i < 25; i++) {
    await vi.dynamicImportSettled()
  }
  await nextTick()
}

describe('header.vue', () => {
  let i18n

  beforeEach(() => {
    i18n = setupI18n()
  })

  it('renders translations correctly', async () => {
    const wrapper = mount(Header, { global: { plugins: [i18n] } })
    await waitForAsyncOperations()
    expect(wrapper.find('.header__title').text()).toBe('Banking flows')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('emits click event when button is clicked', async () => {
    const wrapper = mount(Header, { global: { plugins: [i18n] } })
    await waitForAsyncOperations()
    expect(wrapper.vm.openDrawer).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    expect(wrapper.vm.openDrawer).toBeTruthy()
  })
})
