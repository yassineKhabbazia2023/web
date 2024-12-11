import { nextTick } from 'vue'
import {
  type VueWrapper,
  type DOMWrapper,
  mount,
  flushPromises,
} from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { AddCustomerDrawerProps } from './AddCustomerDrawerTypes'
import { entityMock } from '@entities/../tests/mocks/EntitiesMocks'
import * as accountServices from '@entities/services/account'
import { amplitudeService } from '@pulse/common'
import AddCustomerDrawer from '.'

// Mocks
const formDataMock = {
  email: 'this@isafakeemail.cc',
}
const defaultProps = {
  modelValue: true,
  targetEntityId: entityMock.accountId,
  targetEntityName: entityMock.legalName,
  targetEntityNumber: entityMock.accountNumber,
}
export const debounceMock = vi.fn((callback: Function) => callback)
vi.mock('@pulse/common', () => ({
  debounce: (callback: Function) => debounceMock(callback),
  amplitudeService: {
    track: vi.fn(),
  },
}))

const createWrapper = (
  props: AddCustomerDrawerProps = defaultProps,
): VueWrapper => {
  return mount(AddCustomerDrawer, {
    props,
  })
}

// Component selector helpers
const findInputValidationError = () => wrapper.find('.is-error')
const findNextPreviousButton = () =>
  wrapper.findComponent({ name: 'NextPreviousButtons' })
const getEmailField = (): DOMWrapper<HTMLInputElement> =>
  wrapper.find('[data-testid="email-input"]')

const fillEmailField = () => {
  const emailInput = getEmailField()

  const { email } = formDataMock
  emailInput.setValue(email)
}

let wrapper: VueWrapper
describe('addCustomerDrawer', () => {
  beforeEach(async () => {
    vi.useFakeTimers()

    // 🕵️ Spies
    vi.spyOn(accountServices, 'checkContactHasRoleOnAccount').mockResolvedValue(
      false,
    )
    vi.spyOn(accountServices, 'createCustomer').mockResolvedValue(
      'Customer has been created successfully!',
    )

    wrapper = createWrapper()
    await nextTick()
  })
  describe('display', () => {
    it.each([
      {
        display: false,
      },
      {
        display: true,
      },
    ])(
      'should open the drawer if the modelValue is %s',
      async ({ display }) => {
        const addCustomerDrawer = wrapper.findComponent({ name: 'PDrawer' })
        wrapper.setProps({ modelValue: display })
        await nextTick()

        expect(addCustomerDrawer.props('modelValue')).toBe(display)
      },
    )

    it('should have the nextButton disabled by default', () => {
      const nextPreviousButtonsWrapper = findNextPreviousButton()

      expect(
        nextPreviousButtonsWrapper.props('isNextButtonDisabled'),
      ).toBeTruthy()
    })
  })
  describe('interactions', () => {
    it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
      const addCustomerDrawer = wrapper.findComponent({ name: 'PDrawer' })
      addCustomerDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it('should correctly bind the email value', async () => {
      fillEmailField()
      const emailInput = getEmailField()
      await nextTick()

      expect(emailInput.element.value).toBe(formDataMock.email)
    })
    it('should close the drawer when the close-drawer-button event is emitted', async () => {
      const addCustomerDrawer = wrapper.findComponent({ name: 'PDrawer' })
      addCustomerDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(addCustomerDrawer.isVisible()).toBeFalsy()
    })
    it('should close the drawer when the previous button is clicked', async () => {
      const addCustomerDrawer = wrapper.findComponent({ name: 'PDrawer' })
      const nextPreviousButtonsWrapper = findNextPreviousButton()
      nextPreviousButtonsWrapper.vm.$emit('clickPrevious')
      await nextTick()

      expect(addCustomerDrawer.isVisible()).toBeFalsy()
    })
    it('should close the drawer when the cancel button is clicked', async () => {
      fillEmailField()
      // To simulate the debounce time
      vi.advanceTimersByTime(600)

      const nextPreviousButtonsWrapper = findNextPreviousButton()
      await nextPreviousButtonsWrapper.vm.$emit('clickNext')
      await flushPromises()

      const addCustomerDrawer = wrapper.findComponent({ name: 'PDrawer' })
      const addCustomerCancelButton = wrapper.findComponent(
        '[data-testid=add-customer-cancel-button]',
      )
      await addCustomerCancelButton.trigger('click')

      expect(addCustomerDrawer.isVisible()).toBeFalsy()
    })

    it('should show a form validation error if the email is not valid', async () => {
      expect(findInputValidationError().exists()).toBeFalsy()

      const emailInput = getEmailField()
      emailInput.setValue('falseEmail')
      await emailInput.trigger('blur')
      await flushPromises()

      expect(findInputValidationError().exists()).toBeTruthy()
    })
    it('should display a danger alert if the contact already has a role on the current account', async () => {
      vi.spyOn(
        accountServices,
        'checkContactHasRoleOnAccount',
      ).mockResolvedValue(true)

      fillEmailField()
      // To simulate the debounce time
      vi.advanceTimersByTime(600)

      const nextPreviousButtonsWrapper = findNextPreviousButton()
      await flushPromises()
      const alertContactExists = wrapper.findComponent({ name: 'PAlert' })

      expect(alertContactExists.exists()).toBeTruthy()
      expect(
        nextPreviousButtonsWrapper.props('isNextButtonDisabled'),
      ).toBeTruthy()
    })
    it('should display AddCustomerFeedback with a success message when the contact is created', async () => {
      const createCustomerSpy = vi.spyOn(accountServices, 'createCustomer')
      fillEmailField()
      // To simulate the debounce time
      vi.advanceTimersByTime(600)

      const nextPreviousButtonsWrapper = findNextPreviousButton()
      await nextPreviousButtonsWrapper.vm.$emit('clickNext')
      await flushPromises()
      const addCustomerFeedbackWrapper = wrapper.findComponent({
        name: 'AddCustomerFeedback',
      })

      expect(createCustomerSpy).toHaveBeenCalledOnce()
      expect(createCustomerSpy).toHaveBeenCalledWith({
        firstName: 'Nouvel',
        lastName: 'Utilisateur',
        mobilePhone: '',
        email: formDataMock.email,
        accountNumber: entityMock.accountNumber,
      }, entityMock.accountId)
      expect(addCustomerFeedbackWrapper.exists()).toBeTruthy()
      expect(addCustomerFeedbackWrapper.props('hasError')).toBeFalsy()
    })
    it('should track an amplitude event when successfully creating a contact', async () => {
      const trackAmplitudeSpy = vi.spyOn(amplitudeService, 'track')
      fillEmailField()
      // To simulate the debounce time
      vi.advanceTimersByTime(600)

      const nextPreviousButtonsWrapper = findNextPreviousButton()
      await nextPreviousButtonsWrapper.vm.$emit('clickNext')
      await flushPromises()

      expect(trackAmplitudeSpy).toHaveBeenCalledOnce()
      expect(trackAmplitudeSpy).toHaveBeenCalledWith('Onboarding Started', {
        onboarding_start_localisation: "Ajout d'un utilisateur",
        onboarding_start_result: 'succeeded',
      })
      expect(wrapper.emitted('refresh-customers-list')).toBeTruthy()
    })
    it('should track an amplitude event when failing to create the contact', async () => {
      const trackAmplitudeSpy = vi.spyOn(amplitudeService, 'track')
      // Throw a bad request error (400)
      vi.spyOn(accountServices, 'createCustomer').mockRejectedValue({
        response: { status: 400 },
      })

      fillEmailField()
      // To simulate the debounce time
      vi.advanceTimersByTime(600)

      const nextPreviousButtonsWrapper = findNextPreviousButton()
      nextPreviousButtonsWrapper.vm.$emit('clickNext')
      await flushPromises()

      expect(trackAmplitudeSpy).toHaveBeenCalledOnce()
      expect(trackAmplitudeSpy).toHaveBeenCalledWith('Onboarding Started', {
        onboarding_start_localisation: "Ajout d'un utilisateur",
        onboarding_start_result: 'failed',
      })
    })
    it('should create the role on the account if the contact exists in the database', async () => {
      const trackAmplitudeSpy = vi.spyOn(amplitudeService, 'track')
      // Throw a conflict error (409)
      vi.spyOn(accountServices, 'createCustomer').mockRejectedValue({
        response: { status: 409 },
      })
      vi.spyOn(accountServices, 'addContactToEntity').mockReturnValue({} as any)
      const addContactToEntitySpy = vi.spyOn(
        accountServices,
        'addContactToEntity',
      )

      fillEmailField()
      // To simulate the debounce time
      vi.advanceTimersByTime(600)

      const nextPreviousButtonsWrapper = findNextPreviousButton()
      nextPreviousButtonsWrapper.vm.$emit('clickNext')
      await flushPromises()

      expect(addContactToEntitySpy).toHaveBeenCalledOnce()
      expect(addContactToEntitySpy).toHaveBeenCalledWith(
        entityMock.accountId,
        0,
        formDataMock.email,
      )
      expect(trackAmplitudeSpy).toHaveBeenCalledOnce()
      expect(trackAmplitudeSpy).toHaveBeenCalledWith('Onboarding Started', {
        onboarding_start_localisation: "Ajout d'un utilisateur",
        onboarding_start_result: 'succeeded',
      })
      expect(wrapper.emitted('refresh-customers-list')).toBeTruthy()
    })
    it('should track an amplitude event when creating a role to the account fails', async () => {
      const trackAmplitudeSpy = vi.spyOn(amplitudeService, 'track')
      // Throw a conflict error (409)
      vi.spyOn(accountServices, 'createCustomer').mockRejectedValue({
        response: { status: 409 },
      })
      vi.spyOn(accountServices, 'addContactToEntity').mockRejectedValue(
        'API Error: 503 Service Unavailable',
      )

      fillEmailField()
      // To simulate the debounce time
      vi.advanceTimersByTime(600)

      const nextPreviousButtonsWrapper = findNextPreviousButton()
      nextPreviousButtonsWrapper.vm.$emit('clickNext')
      await flushPromises()

      expect(trackAmplitudeSpy).toHaveBeenCalledOnce()
      expect(trackAmplitudeSpy).toHaveBeenCalledWith('Onboarding Started', {
        onboarding_start_localisation: "Ajout d'un utilisateur",
        onboarding_start_result: 'failed',
      })
    })
  })
})
