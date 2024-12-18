import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import AddCustomerFeedback from '.'
import type { AddCustomerFeedbackProps } from './AddCustomerFeedbackTypes'

const defaultProps = {
  fullName: 'Amaury Leplubo',
  email: 'this@isafakeemail.cc',
  hasError: false,
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const createWrapper = (
  props: AddCustomerFeedbackProps = defaultProps,
): VueWrapper => {
  return mount(AddCustomerFeedback, {
    props,
    global: {
      provide: {
        i18n,
      },
      stubs: ['PUserCard'],
    },
  })
}

let wrapper = createWrapper()

describe('add customer drawer', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('add customer feedback', () => {
    it('should render image and text when hasError is false', () => {
      const successTextWrapper = wrapper.find('[data-testid=valid-add-customer-request-text]')
      expect(successTextWrapper.exists()).toBeTruthy()
    })

    it('should render image and alert when hasError is true', () => {
      wrapper = createWrapper({
        ...defaultProps,
        hasError: true,
      })
      const alertWrapper = wrapper.findComponent({ name: 'PAlert' })
      const successTextWrapper = wrapper.find('[data-testid=valid-add-customer-request-text]')

      expect(alertWrapper.exists()).toBeTruthy()
      expect(successTextWrapper.exists()).toBeFalsy()
    })
  })
})
