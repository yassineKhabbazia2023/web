import { expect, beforeEach, describe, it } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { getMockedOperations } from '@entities/common/mocks/mockedOperations'
import { nextTick } from 'vue'
import { mockSelectedEntity } from '@entities/../vitest.setup'
import type { ConfirmActionModalProps } from './ConfirmActionModalTypes'
import ConfirmActionModal from '.'

const createWrapper = (overriddenProps?: Partial<ConfirmActionModalProps>) => {
  const props = {
    modelValue: true,
    selectedOperation: getMockedOperations()[0],
    isOperationPendingRefusal: false,
    ...overriddenProps,
  }
  return mount(ConfirmActionModal, {
    props,
  })
}

describe('confirmActionModal Component - Displays pending operations with approve and reject actions', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    setActivePinia(createTestingPinia())
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    // FIXME fix the test and unskip or delete it
    it.skip('should present the accurate note if the modal is in a state of refusal', async () => {
      wrapper = createWrapper({
        isOperationPendingRefusal: true,
      })
      await flushPromises()

      const confirmationModal = wrapper.findComponent({
        name: 'ConfirmationModal',
      })
      const legalName = confirmationModal.find(
        '[data-testid=legal-name-confirmation-modal]',
      )
      const accountNumber = confirmationModal.find(
        '[data-testid=account-number-confirmation-modal]',
      )

      expect(legalName.text()).toBe(mockSelectedEntity.legalName)
      expect(accountNumber.text()).toBe(mockSelectedEntity.accountNumber)
    })
  })
  describe('events', () => {
    it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
      const confirmationModal = wrapper.findComponent({
        name: 'ConfirmationModal',
      })
      confirmationModal.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should emit the 'confirm-action' event upon clicking the confirm action button", async () => {
      const confirmationModal = wrapper.findComponent({
        name: 'ConfirmationModal',
      })
      confirmationModal.vm.$emit('confirm')
      await nextTick()

      expect(wrapper.emitted('confirm-action')).toBeTruthy()
    })
    it("should emit the 'update:modelValue' event when the default value of the textarea is changed", async () => {
      const reasonForRefusal =
        'Due to our internal policy restrictions, we are unable to grant access at this time'
      wrapper = createWrapper({
        isOperationPendingRefusal: true,
      })
      await flushPromises()

      const reasonForRefusalInput = wrapper.findComponent({ name: 'PInput' })
      reasonForRefusalInput.setValue(reasonForRefusal)

      expect(reasonForRefusalInput.emitted('update:modelValue')).toStrictEqual([
        [reasonForRefusal],
      ])
    })
  })
})
