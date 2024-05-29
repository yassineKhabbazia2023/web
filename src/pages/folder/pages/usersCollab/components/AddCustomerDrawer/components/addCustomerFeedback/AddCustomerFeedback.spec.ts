import { PImage, PAlert } from '@kpmg/styleguide'
import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import AddCustomerFeedback from '.'
import type { AddCustomerFeedbackProps } from './AddCustomerFeedbackTypes'

const defaultProps = {
  fullName: 'Amaury Linde',
  email: 'amaury@linde.fr',
  isError: false,
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

function getImageWrapper(wrapper: VueWrapper) {
  return wrapper.findComponent(PImage)
}

function findSuccessTextWrapper(wrapper: VueWrapper) {
  return wrapper.find('[data-testid=valid-add-customer-request-text]')
}

describe('add customer drawer', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('add customer feedback', () => {
    it('should render image and text when isError is false', () => {
      const imageWrapper = getImageWrapper(wrapper)
      const successTextWrapper = findSuccessTextWrapper(wrapper)
      expect(imageWrapper.props('pName')).toBe('ok')
      expect(successTextWrapper.exists()).toBeTruthy()
    })

    it('should render image and alert when isError is true', () => {
      wrapper = createWrapper({
        ...defaultProps,
        isError: true,
      })
      const imageWrapper = getImageWrapper(wrapper)
      const alertWrapper = wrapper.findComponent(PAlert)
      const successTextWrapper = findSuccessTextWrapper(wrapper)

      expect(imageWrapper.props('pName')).toBe('maintenance')
      expect(alertWrapper.exists()).toBeTruthy()
      expect(successTextWrapper.exists()).toBeFalsy()
    })
  })
})
