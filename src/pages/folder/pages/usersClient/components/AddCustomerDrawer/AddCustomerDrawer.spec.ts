import { nextTick } from 'vue'
import { PDrawer } from '@kpmg/styleguide'
import { type VueWrapper, type DOMWrapper, mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import type { AddCustomerDrawerProps } from './AddCustomerDrawerTypes'
import { entityMock } from '@/../tests/mocks/EntitiesMocks'
import NextPreviousButtons from '@/common/components/NextPreviousButtons'
import AddCustomerDrawer from '.'
import AddCustomerFeedback from './components/addCustomerFeedback'
import { getMockedCustomer } from '@/services/contact/contactMocks'

const customerMock = getMockedCustomer()[0]

let gatewayPostMock = vi.fn().mockResolvedValue({})
const gatewayGetMock = vi.fn(() => {
  return Promise.resolve({
    data: { items: [customerMock] },
    status: 200,
  })
})

export const debounceMock = vi.fn((callback: Function) => callback)
vi.mock('@kpmg/common', () => ({
  debounce: (callback: Function) => debounceMock(callback),
  commonApi: () => ({
    gateway: {
      post: gatewayPostMock,
      get: gatewayGetMock,
    },
  }),
}))

const defaultProps = {
  modelValue: true,
  targetEntityId: entityMock.accountId,
  targetEntityName: entityMock.legalName,
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const createWrapper = (
  props: AddCustomerDrawerProps = defaultProps,
): VueWrapper => {
  return mount(AddCustomerDrawer, {
    props,
    global: {
      provide: {
        i18n,
      },
    },
  })
}

let wrapper: VueWrapper

const findNextPreviousButton = (wrapper: VueWrapper) =>
  wrapper.findComponent(NextPreviousButtons)

const findAddCustomerDrawer = (wrapper: VueWrapper) =>
  wrapper.findComponent(PDrawer)

const findAddCustomerFeedback = (wrapper: VueWrapper) =>
  wrapper.findComponent(AddCustomerFeedback)

const formDataMock = {
  email: 'this@isafakeemail.cc',
  firstName: 'Amaury',
  lastName: 'Leplubo',
  mobilePhone: '0123456789',
}

function fillFormFields(wrapper: VueWrapper) {
  const {
    emailInput,
    lastNameInput,
    firstNameInput,
    mobilePhoneInput,
  } = getFormFields(wrapper)

  const { email, firstName, lastName, mobilePhone } = formDataMock
  emailInput.setValue(email)
  firstNameInput.setValue(firstName)
  lastNameInput.setValue(lastName)
  mobilePhoneInput.setValue(mobilePhone)
}

function getFormFields(wrapper: VueWrapper) {
  const inputs = wrapper.findAll('[data-testid$="-input"]') as DOMWrapper<HTMLInputElement>[]
  const emailInput = inputs[0]
  const lastNameInput = inputs[1]
  const firstNameInput = inputs[2]
  const mobilePhoneInput = inputs[3]

  return {
    emailInput,
    lastNameInput,
    firstNameInput,
    mobilePhoneInput,
  }
}

describe('add customer drawer', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('rendering', () => {
    it.each([
      {
        shouldBeVisible: false,
      },
      {
        shouldBeVisible: true,
      },
    ])('should exist depending of modelValue', async ({ shouldBeVisible }) => {
      const drawerWrapper = findAddCustomerDrawer(wrapper)
      wrapper.setProps({ modelValue: shouldBeVisible })
      await nextTick()
      expect(drawerWrapper.props('modelValue')).toBe(shouldBeVisible)
    })

    it('should have nextButton disabled by default', () => {
      const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
      expect(nextPreviousButtonsWrapper.props('isNextButtonDisabled')).toBeTruthy()
    })

    it('should render add customer feedback after form submit', async () => {
      vi.useFakeTimers()
      fillFormFields(wrapper)
      // To simulate the debounce time
      vi.advanceTimersByTime(600)
      const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
      await nextPreviousButtonsWrapper.vm.$emit('click-next')
      await flushPromises()
      await nextTick()

      const addCustomerFeedbackWrapper = findAddCustomerFeedback(wrapper)
      expect(addCustomerFeedbackWrapper.exists()).toBeTruthy()
      expect(addCustomerFeedbackWrapper.props('isError')).toBeFalsy()
      vi.clearAllTimers()
    })

    it('should still render add customer feedback after form submit', async () => {
      gatewayPostMock = vi.fn().mockRejectedValue({})
      vi.useFakeTimers()
      fillFormFields(wrapper)
      // To simulate the debounce time
      vi.advanceTimersByTime(600)
      const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
      await nextPreviousButtonsWrapper.vm.$emit('click-next')
      await flushPromises()
      await nextTick()

      const addCustomerFeedbackWrapper = findAddCustomerFeedback(wrapper)
      expect(addCustomerFeedbackWrapper.exists()).toBeTruthy()
      expect(addCustomerFeedbackWrapper.props('isError')).toBeTruthy()
      vi.clearAllTimers()
    })

    it('should also render add customer feedback after form submit', async () => {
      vi.useFakeTimers()
      fillFormFields(wrapper)
      vi.advanceTimersByTime(600)
      const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
      await nextPreviousButtonsWrapper.vm.$emit('click-next')
      await flushPromises()
      await nextTick()

      const addCustomerFeedbackWrapper = findAddCustomerFeedback(wrapper)
      expect(addCustomerFeedbackWrapper.exists()).toBeTruthy()
      expect(addCustomerFeedbackWrapper.props('isError')).toBeFalsy()
      vi.clearAllTimers()
    })
  })

  describe('interactions', () => {
    it('should fill the form if email exists', async () => {
      const { emailInput, lastNameInput, firstNameInput, mobilePhoneInput } = getFormFields(wrapper)
      emailInput.setValue(formDataMock.email)
      await emailInput.trigger('blur')
      await flushPromises()
      await nextTick()

      expect(lastNameInput.element.value).toBe(customerMock.lastName)
      expect(lastNameInput.element.disabled).toBeTruthy()
      expect(firstNameInput.element.value).toBe(customerMock.firstName)
      expect(firstNameInput.element.disabled).toBeTruthy()
      expect(mobilePhoneInput.element.value).toBe(customerMock.mobilePhone)
      expect(mobilePhoneInput.element.disabled).toBeTruthy()

      const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
      expect(nextPreviousButtonsWrapper.props('isNextButtonDisabled')).toBeFalsy()
    })

    it('should bind values', () => {
      fillFormFields(wrapper)
      const { emailInput, lastNameInput, firstNameInput, mobilePhoneInput } = getFormFields(wrapper)
      const { email, firstName, lastName, mobilePhone } = formDataMock

      expect(emailInput.element.value).toBe(email)
      expect(firstNameInput.element.value).toBe(firstName)
      expect(lastNameInput.element.value).toBe(lastName)
      expect(mobilePhoneInput.element.value).toBe(mobilePhone)
    })
  })
})
