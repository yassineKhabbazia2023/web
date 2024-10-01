import { PImage, PAlert } from '@pulse/styleguide'
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

function getImageWrapper() {
  return wrapper.findComponent(PImage)
}

function findSuccessTextWrapper() {
  return wrapper.find('[data-testid=valid-add-customer-request-text]')
}

describe('add customer drawer', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('add customer feedback', () => {
    it('should render image and text when hasError is false', () => {
      const imageWrapper = getImageWrapper()
      const successTextWrapper = findSuccessTextWrapper()
      expect(imageWrapper.props('pName')).toBe('ok')
      expect(successTextWrapper.exists()).toBeTruthy()
    })

    it('should render image and alert when hasError is true', () => {
      wrapper = createWrapper({
        ...defaultProps,
        hasError: true,
      })
      const imageWrapper = getImageWrapper()
      const alertWrapper = wrapper.findComponent(PAlert)
      const successTextWrapper = findSuccessTextWrapper()

      expect(alertWrapper.exists()).toBeTruthy()
      expect(successTextWrapper.exists()).toBeFalsy()
      expect(imageWrapper.props('pName')).toBe('maintenance')
    })
  })
})
