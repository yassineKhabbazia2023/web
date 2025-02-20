import { nextTick } from 'vue'
import { expect, beforeEach, describe, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { amplitudeService } from '@pulse/common'
import type { PButton } from '@pulse/styleguide/components'
import type { ComponentWrapper } from '@entities/common/types'
import { getMockedOperations } from '@entities/common/mocks/mockedOperations'
import { AmplitudeOperationStatus } from './PendingOperationsTableTypes'
import { OperationStatus } from '@entities/common/types/OperationTypes'
import * as commonUtils from '@entities/common/utils'
import PendingOperationsTable from '.'

// Mocks
const mockedOperations = getMockedOperations()
const serviceMethodsMocks = vi.hoisted(() => ({
  patchOperationStatusMock: vi.fn(),
}))
vi.mock('@entities/services/contact', () => ({
  patchOperationStatus: serviceMethodsMocks.patchOperationStatusMock,
}))

const createWrapper = () => {
  return mount(PendingOperationsTable, {
    global: {
      stubs: {
        ConfirmActionModal: {
          name: 'ConfirmActionModal',
          template: '<div></div>',
          emits: ['confirm-action', 'update:modelValue'],
          props: ['modelValue'],
        },
        PDoubleText: true,
        PButton: true,
        PIcon: true,
      },
    },
  })
}

describe('pendingOperationsTable Component - Displays pending operations with approve and reject actions', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof PendingOperationsTable>>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('events', () => {
    it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
      wrapper.vm.isConfirmationModalVisible = true
      wrapper.vm.selectedOperation = mockedOperations[0]
      await nextTick()
      const confirmActionModal = wrapper.findComponent({
        name: 'ConfirmActionModal',
      })
      confirmActionModal.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(confirmActionModal.emitted('update:modelValue')).toStrictEqual([
        [false],
      ])
    })
    it('should call the patch endpoint with correct params and trigger events to Amplitude for rejection', async () => {
      const spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
      wrapper = createWrapper()
      await wrapper.vm.handleRejectOperation(mockedOperations[0])
      await nextTick()

      const confirmActionModal = wrapper.findComponent({
        name: 'ConfirmActionModal',
      })
      confirmActionModal.vm.$emit(
        'confirm-action',
        'We are unable to grant access at this time',
      )
      await flushPromises()

      expect(
        serviceMethodsMocks.patchOperationStatusMock,
      ).toHaveBeenCalledOnce()
      expect(serviceMethodsMocks.patchOperationStatusMock).toHaveBeenCalledWith(
        mockedOperations[0].operationId,
        OperationStatus.REJECTED,
      )
      expect(spyTrackAmplitude).toHaveBeenNthCalledWith(
        2,
        'Registry Validation Completed',
        {
          registry_validation_reason:
            'We are unable to grant access at this time',
          registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
        },
      )
    })
    it('should call the patch endpoint with correct params and trigger events to Amplitude for approval', async () => {
      const spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
      wrapper = createWrapper()
      await wrapper.vm.handleApproveOperation(mockedOperations[0])
      await nextTick()

      const confirmActionModal = wrapper.findComponent({
        name: 'ConfirmActionModal',
      })
      confirmActionModal.vm.$emit('confirm-action')
      await flushPromises()

      expect(
        serviceMethodsMocks.patchOperationStatusMock,
      ).toHaveBeenCalledOnce()
      expect(serviceMethodsMocks.patchOperationStatusMock).toHaveBeenCalledWith(
        mockedOperations[0].operationId,
        OperationStatus.APPROVED,
      )
      expect(spyTrackAmplitude).toHaveBeenNthCalledWith(
        2,
        'Registry Validation Completed',
        {
          registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
        },
      )
    })
    it('should display an error notification when the patch call fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      const spyDisplayNotification = vi.spyOn(
        commonUtils,
        'displayNotification',
      )
      serviceMethodsMocks.patchOperationStatusMock.mockRejectedValue(
        expectedErrorMessage,
      )
      wrapper = createWrapper()
      await wrapper.vm.handleApproveOperation(mockedOperations[0])
      await nextTick()

      const confirmActionModal = wrapper.findComponent({
        name: 'ConfirmActionModal',
      })
      confirmActionModal.vm.$emit('confirm-action')
      await flushPromises()

      expect(spyDisplayNotification).toHaveBeenCalledOnce()
      expect(spyDisplayNotification).toHaveBeenCalledWith(
        'error',
        'The operation failed due to a technical error. Please try again later.',
      )
    })
    it("should send 'Registry Validation Started' event to Amplitude when the reject action is clicked", async () => {
      const spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
      const rejectOperationButton = wrapper.findComponent(
        '[data-testid=reject-access-button]',
      ) as ComponentWrapper<InstanceType<typeof PButton>>

      await rejectOperationButton.trigger('click')

      expect(wrapper.vm.isConfirmationModalVisible).toBeTruthy()
      expect(wrapper.vm.isOperationPendingRefusal).toBeTruthy()
      expect(spyTrackAmplitude).toHaveBeenCalledOnce()
      expect(spyTrackAmplitude).toHaveBeenCalledWith(
        'Registry Validation Started',
        {
          registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
        },
      )
    })
    it("should send 'Registry Validation Started' event to Amplitude when the approve action is clicked", async () => {
      const spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
      const approveOperationButton = wrapper.findComponent(
        '[data-testid=approve-access-button]',
      ) as ComponentWrapper<InstanceType<typeof PButton>>

      await approveOperationButton.trigger('click')

      expect(wrapper.vm.isConfirmationModalVisible).toBeTruthy()
      expect(wrapper.vm.isOperationPendingRefusal).toBeFalsy()
      expect(spyTrackAmplitude).toHaveBeenCalledOnce()
      expect(spyTrackAmplitude).toHaveBeenCalledWith(
        'Registry Validation Started',
        {
          registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
        },
      )
    })
  })
})
