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
import { createCustomer } from '@/services/account'

const customerMock = getMockedCustomer()[0]

export const debounceMock = vi.fn((callback: Function) => callback)

vi.mock('@/services/account', () => {
  const createCustomerMock = vi.fn(() => {
    return Promise.resolve({
      data: {
        id: customerMock.id,
      },
    })
  })
  const addContactToEntityMock = vi.fn().mockResolvedValue({})

  const getAccountUserByEmailMock = vi.fn(() => {
    return Promise.resolve({ ...customerMock })
  })
  return {
    createCustomer: createCustomerMock,
    addContactToEntity: addContactToEntityMock,
    getAccountUserByEmail: getAccountUserByEmailMock,
  }
})

vi.mock('@kpmg/common', () => ({
  debounce: (callback: Function) => debounceMock(callback),
}))

const defaultProps = {
  modelValue: true,
  targetEntityId: entityMock.accountId,
  targetEntityName: entityMock.legalName,
  targetEntityNumber: entityMock.accountNumber,
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
  const inputs: DOMWrapper<HTMLInputElement>[] = wrapper.findAll('[data-testid$="-input"]')
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
      // @ts-ignore
      createCustomer.mockRejectedValue(null)
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
  })

  describe('interactions', () => {
    it('should fill the form if email exists', async () => {
      const { emailInput, lastNameInput, firstNameInput, mobilePhoneInput } = getFormFields(wrapper)
      emailInput.setValue(formDataMock.email)
      await emailInput.trigger('blur')
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

    it('should bind values', async () => {
      fillFormFields(wrapper)
      const { emailInput, lastNameInput, firstNameInput, mobilePhoneInput } = getFormFields(wrapper)
      const { email, firstName, lastName, mobilePhone } = formDataMock
      await nextTick()

      expect(emailInput.element.value).toBe(email)
      expect(firstNameInput.element.value).toBe(firstName)
      expect(lastNameInput.element.value).toBe(lastName)
      expect(mobilePhoneInput.element.value).toBe(mobilePhone)
    })

    it('should close the drawer on close-drawer-button event', async () => {
      const drawerWrapper = findAddCustomerDrawer(wrapper)
      drawerWrapper.vm.$emit('close-drawer-button')
      await nextTick()
      expect(drawerWrapper.isVisible()).toBeFalsy()
    })
  })
})
