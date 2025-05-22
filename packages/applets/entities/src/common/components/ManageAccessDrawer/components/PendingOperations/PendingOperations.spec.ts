import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { amplitudeServiceTrackMock, amplitudeServiceMock } from '@pulse/common/mocks'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import type { PendingOperationProps } from './PendingOperations.types'
import { AmplitudeOperationStatus, TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'
import { OperationStatus } from '@entities/common/types/OperationTypes'
import * as commonUtils from '@entities/common/utils'

import PendingOperationsTable from '.'

vi.mock('@pulse/common', () => ({
  amplitudeService: amplitudeServiceMock,
}))

const trackingLocalisationMock = TrackingLocalisation.WALLET

const accountOperationsListMock = getAccountOperationsListMock()
const serviceMethodsMocks = vi.hoisted(() => ({
  patchOperationStatusMock: vi.fn(),
}))
vi.mock('@entities/services/contact', () => ({
  patchOperationStatus: serviceMethodsMocks.patchOperationStatusMock,
}))

const defaultProps = {
  isGlobalMode: false,
  trackingLocalisation: trackingLocalisationMock,
  accountOperationsList: accountOperationsListMock,
}
const createWrapper = (overrideProps: Partial<PendingOperationProps> = {}) => {
  const props: PendingOperationProps = {
    ...defaultProps,
    ...overrideProps,
  }

  return shallowMount(PendingOperationsTable, {
    props,
    global: {
      stubs: {
        ConfirmActionModal: {
          name: 'ConfirmActionModal',
          template: '<div></div>',
          emits: ['confirm-action', 'update:modelValue'],
          props: ['modelValue', 'legalName'],
        },
        PAccordion: {
          name: 'PAccordion',
          template: '<div><slot name="header" /><slot /></div>',
        },
      },
    },
  })
}

describe('PendingOperations', () => {
  describe('events', () => {
    const tests = [{
      isGlobalMode: false,
    }, {
      isGlobalMode: true,
    }]
    it.each(tests)('should display properly when isGlobalMode equals $isGlobalMode', async ({
      isGlobalMode,
    }) => {
      const wrapper = createWrapper({ isGlobalMode })

      const snapFilepath = `__snap__/PendingOperations.isGlobalMode.${isGlobalMode ? 'true' : 'false'}.html`
      await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
    })

    it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
      const wrapper = createWrapper()

      wrapper.vm.isConfirmationModalVisible = true
      wrapper.vm.selectedOperation = accountOperationsListMock[0].operations[0]
      await nextTick()
      const confirmActionModal = wrapper.findComponent({
        name: 'ConfirmActionModal',
      })
      confirmActionModal.vm.$emit('update:modelValue', false)

      expect(confirmActionModal.emitted('update:modelValue')).toStrictEqual([
        [false],
      ])
    })
    it('should call the patch endpoint with correct params and trigger events to Amplitude for rejection', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.handleRejectOperation(accountOperationsListMock[0].operations[0])

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
        accountOperationsListMock[0].operations[0].operationId,
        OperationStatus.REJECTED,
      )
      expect(amplitudeServiceTrackMock).toHaveBeenNthCalledWith(
        2,
        'Registry Validation Completed',
        {
          registry_validation_reason:
            'We are unable to grant access at this time',
          registry_validation_start_localisation: trackingLocalisationMock,
          registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
        },
      )
    })
    it('should call the patch endpoint with correct params and trigger events to Amplitude for approval', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.handleApproveOperation(accountOperationsListMock[0].operations[0])

      const confirmActionModal = wrapper.findComponent({
        name: 'ConfirmActionModal',
      })
      confirmActionModal.vm.$emit('confirm-action')
      await flushPromises()

      expect(
        serviceMethodsMocks.patchOperationStatusMock,
      ).toHaveBeenCalledOnce()
      expect(serviceMethodsMocks.patchOperationStatusMock).toHaveBeenCalledWith(
        accountOperationsListMock[0].operations[0].operationId,
        OperationStatus.APPROVED,
      )
      expect(amplitudeServiceTrackMock).toHaveBeenNthCalledWith(
        2,
        'Registry Validation Completed',
        {
          registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
          registry_validation_start_localisation: trackingLocalisationMock,
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
      const wrapper = createWrapper()
      await wrapper.vm.handleApproveOperation(accountOperationsListMock[0].operations[0])

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
      const wrapper = createWrapper()
      const pendingOperationsTable = wrapper.findComponent({ name: 'PendingOperationsTable' })

      await pendingOperationsTable.vm.$emit('reject-operation')

      expect(wrapper.vm.isConfirmationModalVisible).toBeTruthy()
      expect(wrapper.vm.isOperationPendingRefusal).toBeTruthy()
      expect(amplitudeServiceTrackMock).toHaveBeenCalledOnce()
      expect(amplitudeServiceTrackMock).toHaveBeenCalledWith(
        'Registry Validation Started',
        {
          registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
          registry_validation_start_localisation: trackingLocalisationMock,
        },
      )
    })
    it("should send 'Registry Validation Started' event to Amplitude when the approve action is clicked", async () => {
      const wrapper = createWrapper()
      const pendingOperationsTable = wrapper.findComponent({ name: 'PendingOperationsTable' })

      await pendingOperationsTable.vm.$emit('approve-operation')

      expect(wrapper.vm.isConfirmationModalVisible).toBeTruthy()
      expect(wrapper.vm.isOperationPendingRefusal).toBeFalsy()
      expect(amplitudeServiceTrackMock).toHaveBeenCalledOnce()
      expect(amplitudeServiceTrackMock).toHaveBeenCalledWith(
        'Registry Validation Started',
        {
          registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
          registry_validation_start_localisation: trackingLocalisationMock,
        },
      )
    })
  })

  describe('PFormSearch', () => {
    it('should set search.value when PFormSearch emits update:p-search', async () => {
      const wrapper = createWrapper({
        isGlobalMode: true,
      })
      const newSearch = 'new-search'
      const pFormSearch = wrapper.findComponent({ name: 'PFormSearch' })

      expect(pFormSearch.props('pSearch')).toBe('')

      pFormSearch.vm.$emit('update:p-search', newSearch)
      await nextTick()

      expect(wrapper.emitted('update:search-term')).toStrictEqual([[newSearch]])
    })
  })

  describe('noDemandForSearchTerm', () => {
    const searchTermMock = 'search term'
    const searchTermEmptyMock = ''

    const tests = [{
      searchTerm: searchTermMock,
      accountOperationsList: accountOperationsListMock,
      expectNoDemandForSearchTerm: false,
      description: 'DOES NOT display noDemandForSearchTerm when operations and search terms exist',
    }, {
      searchTerm: searchTermMock,
      accountOperationsList: [],
      expectNoDemandForSearchTerm: true,
      description: 'displays noDemandForSearchTerm when NO operation and search terms exist',
    }, {
      searchTerm: searchTermEmptyMock,
      accountOperationsList: accountOperationsListMock,
      expectNoDemandForSearchTerm: false,
      description: 'DOES NOT display noDemandForSearchTerm when operations exist and NO search terms',
    }, {
      searchTerm: searchTermEmptyMock,
      accountOperationsList: [],
      expectNoDemandForSearchTerm: false,
      description: 'DOES NOT display noDemandForSearchTerm when NO operation and NO search term',
    }]
    it.each(tests)('$description', async ({
      searchTerm,
      accountOperationsList,
      expectNoDemandForSearchTerm,
    }) => {
      const wrapper = createWrapper({
        searchTerm,
        accountOperationsList,
      })

      const noDemandForSearchTerm = wrapper.find('[data-test-id="no-demand-for-search-term"]')
      expect(noDemandForSearchTerm.exists()).toBe(expectNoDemandForSearchTerm)
    })
  })
})
