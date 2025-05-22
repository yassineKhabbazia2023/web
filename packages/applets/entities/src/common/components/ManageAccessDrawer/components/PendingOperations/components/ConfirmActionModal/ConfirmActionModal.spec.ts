import { expect, beforeEach, describe, it } from 'vitest'
import '@entities/__mocks__/common.import.mocks'
import { shallowMount } from '@vue/test-utils'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { nextTick } from 'vue'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'
import type { ConfirmActionModalProps } from './ConfirmActionModalTypes'
import { getStoreMock } from '@pulse/common/mocks'
import { useSelectedEntityStore } from '@pulse/common/stores'

import ConfirmActionModal from '.'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

const legalNameMock = 'Entity Test'

const createWrapper = (overriddenProps?: Partial<ConfirmActionModalProps>) => {
  const props = {
    modelValue: true,
    selectedOperation: getMockedOperations()[0],
    isOperationPendingRefusal: false,
    legalName: legalNameMock,
    ...overriddenProps,
  }
  return shallowMount(ConfirmActionModal, {
    props,
    global: {
      stubs: {
        ConfirmationModal: {
          name: 'ConfirmationModal',
          template: '<div><slot /></div>',
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
        },
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
        },
        PInput: true,
        'i18n-t': {
          template: `<div>
          <slot name="fullName" /> 
          <slot name="accountName" />
          (<slot name="accountNumber"/>)
          </div>`,
        },
      },
    },
  })
}

describe('confirmActionModal Component - Displays pending operations with approve and reject actions', () => {
  beforeEach(async () => {
    selectedEntityStoreMock.selectedEntity = mockedEntity
  })
  describe('display', () => {
    const tests = [{
      isRefused: true,
    }, {
      isRefused: false,
    }]
    it.each(tests)('should display properly when isRefused equals $isRefused', async ({
      isRefused,
    }) => {
      const wrapper = createWrapper({
        isOperationPendingRefusal: isRefused,
      })
      await nextTick()

      const snapFilepath = `__snap__/ConfirmatActionModal.${isRefused ? 'refused' : 'accepted'}.html`
      await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
    })
    it('should present the accurate note if the modal is in a state of refusal', async () => {
      const wrapper = createWrapper({
        isOperationPendingRefusal: true,
        selectedOperation: { ...getMockedOperations()[0], legalName: '' },
      })
      await nextTick()

      const confirmationModal = wrapper.findComponent({
        name: 'ConfirmationModal',
      })
      const legalName = confirmationModal.find(
        '[data-testid=legal-name-confirmation-modal]',
      )
      const accountNumber = confirmationModal.find(
        '[data-testid=account-number-confirmation-modal]',
      )

      expect(legalName.text()).toBe('')
      expect(accountNumber.text()).toBe(getMockedOperations()[0].accountNumber)
    })
    it('should present the accurate note if the modal is in a state of refusal in the main access management page', async () => {
      const wrapper = createWrapper({
        isOperationPendingRefusal: true,
      })
      await nextTick()

      const confirmationModal = wrapper.findComponent({
        name: 'ConfirmationModal',
      })
      const legalName = confirmationModal.find(
        '[data-testid=legal-name-confirmation-modal]',
      )
      const accountNumber = confirmationModal.find(
        '[data-testid=account-number-confirmation-modal]',
      )

      expect(legalName.text()).toBe(legalNameMock)
      expect(accountNumber.text()).toBe(getMockedOperations()[0].accountNumber)
    })
  })
  describe('events', () => {
    let wrapper: ReturnType<typeof createWrapper>
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })
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
      await nextTick()

      const reasonForRefusalInput = wrapper.findComponent({ name: 'PInput' })
      reasonForRefusalInput.vm.$emit('update:modelValue', reasonForRefusal)
      await nextTick()

      expect(reasonForRefusalInput.emitted('update:modelValue')).toStrictEqual([
        [reasonForRefusal],
      ])
    })
  })
})
