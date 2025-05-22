import { nextTick } from 'vue'
import '@entities/__mocks__/common.import.mocks'
import { shallowMount, flushPromises } from '@vue/test-utils'
import type { ManageAccessDrawerGlobalProps } from './ManageAccessDrawerGlobal.types'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'

import ManageAccessDrawerGlobal from '.'

// Mocks
const trackingLocalisationMock = TrackingLocalisation.WALLET

const defaultProps: ManageAccessDrawerGlobalProps = {
  modelValue: true,
  trackingLocalisation: trackingLocalisationMock,
}

const useManageAccessOperationsMock = vi.hoisted(() => vi.fn())
const refreshManageAccessOperationsMock = vi.hoisted(() => vi.fn())

vi.mock('./composables/manageAccessOperations.composable', () => ({
  useManageAccessOperations: useManageAccessOperationsMock,
}))

const totalItemsMock = 2
const currentPageMock = 3
const totalPagesMock = 5
const accountOperationsListMock = getAccountOperationsListMock()

const searchResultMock = {
  items: accountOperationsListMock,
  currentPage: currentPageMock,
  totalItems: totalItemsMock,
  totalPages: totalPagesMock,
}

const createWrapper = (overrideProps: Partial<ManageAccessDrawerGlobalProps> = {}) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  }

  return shallowMount(ManageAccessDrawerGlobal, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot /><slot name="footer" /></div>',
          events: ['close-drawer-button'],
        },
        PendingOperations: {
          name: 'PendingOperations',
          template: '<div />',
          props: {
            isGlobalMode: [Boolean],
            trackingLocalisation: [String],
            accountOperationsList: [Array],
          },
          methods: {
            resetOpenedAccordions: () => {},
          },
        },
      },
    },
  })
}

describe('ManageAccessDrawerGlobal', () => {
  let wrapper: ReturnType<typeof createWrapper>

  describe('display', () => {
    beforeEach(async () => {
      useManageAccessOperationsMock.mockReturnValue({
        searchResult: searchResultMock,
        showPagination: false,
        showNoOperation: false,
        refreshManageAccessOperations: refreshManageAccessOperationsMock,
      })
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should display properly', async () => {
      const pendingOperations = wrapper.findComponent({ name: 'PendingOperations' })
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      expect(pendingOperations.exists()).toBeTruthy()
      expect(pagination.exists()).toBe(false)

      await expect(wrapper.html()).toMatchFileSnapshot('__snap__/manageAccessDrawerGlobal.html')
    })
  })

  describe('events', () => {
    beforeEach(async () => {
      useManageAccessOperationsMock.mockReturnValue({
        searchResult: searchResultMock,
        showPagination: false,
        showNoOperation: false,
        refreshManageAccessOperations: refreshManageAccessOperationsMock,
      })
      wrapper = createWrapper()
      await flushPromises()
    })
    it("should emit 'update:modelValue' event when the drawer is closed", async () => {
      const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
      pDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('should call refreshManageAccessOperations event when PendingOperations emits update-operation-table', async () => {
      const pendingOperations = wrapper.findComponent({ name: 'PendingOperations' })
      pendingOperations.vm.$emit('update-operation-table')
      await nextTick()

      expect(refreshManageAccessOperationsMock).toHaveBeenCalledTimes(2)
    })

    it('should close manage access drawer when clicking on close buton', async () => {
      const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
      pDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
  })

  describe('when showPagination is true', () => {
    beforeEach(() => {
      useManageAccessOperationsMock.mockReturnValue({
        searchResult: searchResultMock,
        showPagination: true,
        refreshManageAccessOperations: refreshManageAccessOperationsMock,
      })
      wrapper = createWrapper()
    })

    it('should display properly the pagination component', () => {
      const expectedProps = {
        pCurrentPage: currentPageMock,
        pHidePageSize: true,
        pPageSize: 5,
        pPageSizeSelectorGroupLabel: undefined,
        pPageSizeSelectorSuffix: undefined,
        pPageSizes: undefined,
        pShowTotalPageCounter: false,
        pTestIdRoot: 'ppagination',
        pTotal: searchResultMock.totalItems,
      }
      const pagination = wrapper.findComponent({ name: 'PPagination' })
      expect(pagination.exists()).toBe(true)

      expect(pagination.props()).toStrictEqual(expectedProps)
    })

    it('should call refreshManageAccessOperations on pagination change', async () => {
      const newCurrentPage = 3
      const expectedParameters = {
        page: newCurrentPage,
      }
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      await pagination.vm.$emit('update:p-current-page', newCurrentPage)

      expect(refreshManageAccessOperationsMock).toHaveBeenCalledTimes(2)
      expect(refreshManageAccessOperationsMock).toHaveBeenCalledWith(expectedParameters)
    })
  })

  describe('when noOperation', () => {
    beforeEach(() => {
      const searchResultMockEmpty = {
        ...searchResultMock,
        items: [],
      }
      useManageAccessOperationsMock.mockReturnValue({
        searchResult: searchResultMockEmpty,
        showPagination: false,
        showNoOperation: true,
        refreshManageAccessOperations: refreshManageAccessOperationsMock,
      })
      wrapper = createWrapper()
    })

    it('should display properly the pagination component', () => {
      const noOperation = wrapper.findComponent({ name: 'NoOperation' })
      const pagination = wrapper.findComponent({ name: 'PPagination' })
      const pendingOperations = wrapper.findComponent({ name: 'PendingOperations' })

      expect(noOperation.exists()).toBe(true)
      expect(pagination.exists()).toBe(false)
      expect(pendingOperations.exists()).toBe(false)
    })
  })
})
