import { nextTick } from 'vue'
import '@entities/__mocks__/common.import.mocks'
import { shallowMount, flushPromises } from '@vue/test-utils'
import type { ManageAccessDrawerProps } from './ManageAccessDrawerTypes'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'
import { getMockedEntity, getStoreMock } from '@pulse/common/mocks'
import { useSelectedEntityStore } from '@pulse/common/stores'

import ManageAccessDrawer from '.'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

// Mocks
const trackingLocalisationMock = TrackingLocalisation.WALLET
const mockedAccount = getMockedEntity({
  accountId: 1,
  legalName: 'Entity Test',
  accountNumber: 'IBS544G45F345F',
  color: 'orange',
})

const accountOperationsListMock = getAccountOperationsListMock()
const defaultProps: ManageAccessDrawerProps = {
  modelValue: true,
  trackingLocalisation: trackingLocalisationMock,
  showAccountName: false,
  accountOperationsList: accountOperationsListMock,
}

const createWrapper = (overrideProps: Partial<ManageAccessDrawerProps> = {}) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  }

  return shallowMount(ManageAccessDrawer, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot /><slot name="footer" /></div>',
          events: ['close-drawer-button'],
        },
      },
    },
  })
}

describe('manageAccessDrawer Component - Drawer containing a table of pending operations', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(async () => {
    selectedEntityStoreMock.selectedEntity = mockedAccount
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should display the drawer header with account information and the pending operations table correctly', () => {
      const userCard = wrapper.findComponent({ name: 'PUserCard' })
      const pendingOperations = wrapper.findComponent({ name: 'PendingOperations' })

      const expectedUserCardProps = {
        pTitle: mockedAccount.legalName,
        pSubtitle: mockedAccount.accountNumber,
      }
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      expect(pendingOperations.exists()).toBeTruthy()
      expect(userCard.props()).toMatchObject(expectedUserCardProps)
      expect(pagination.exists()).toBe(false)
    })

    it('should not display the user card component if defaultEntity is empty', async () => {
      await flushPromises()

      selectedEntityStoreMock.selectedEntity = undefined
      await flushPromises()
      const userCard = wrapper.findComponent({ name: 'PUserCard' })

      expect(userCard.exists()).toBeFalsy()
    })

    const tests = [{
      showAccountName: false,
    }, {
      showAccountName: true,
    }]
    it.each(tests)('should display properly when showAccountName equals $showAccountName', ({
      showAccountName,
    }) => {
      const snapFilepath = `__snap__/manageAccessDrawer.showAccountName.${showAccountName ? 'true' : 'false'}.html`
      expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
    })
  })
  describe('events', () => {
    it("should emit 'update:modelValue' event when the drawer is closed", async () => {
      const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
      pDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should emit 'update-operation-table' event when received event from PendingOperations", async () => {
      const pendingOperations = wrapper.findComponent({ name: 'PendingOperations' })
      pendingOperations.vm.$emit('update-operation-table')
      await nextTick()

      expect(wrapper.emitted('update-operation-table')).toBeTruthy()
    })
    it('should close manage access drawer when clicking on close buton', async () => {
      const manageAccessDrawer = wrapper.findComponent({ name: 'PDrawer' })
      manageAccessDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
  })

  describe('when showPagination is true', () => {
    beforeEach(() => {
      wrapper = createWrapper({
        showPagination: true,
        currentPage: 2,
        pageSize: 5,
        pageCount: 10,
      })
    })
    it('should display properly the pagination component', () => {
      const expectedProps = {
        pCurrentPage: 2,
        pHidePageSize: true,
        pPageSize: 5,
        pPageSizeSelectorGroupLabel: undefined,
        pPageSizeSelectorSuffix: undefined,
        pPageSizes: undefined,
        pShowTotalPageCounter: false,
        pTestIdRoot: 'ppagination',
        pTotal: 10,
      }
      const pagination = wrapper.findComponent({ name: 'PPagination' })
      expect(pagination.exists()).toBe(true)

      expect(pagination.props()).toStrictEqual(expectedProps)
    })

    it('should emit update:current-page on pagination change', () => {
      const newCurrentPage = 3
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      pagination.vm.$emit('update:p-current-page', newCurrentPage)

      expect(wrapper.emitted('update:current-page')).toStrictEqual([[newCurrentPage]])
    })
  })
})
