import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

import { getFormattedMockReports } from '@entities/__mocks__/bi-report.mocks'
import { PAGE_SIZES } from '@entities/constants'
import BiReportsList from '.'

const mockReports = getFormattedMockReports()
const mockApiResponse = {
  items: mockReports,
  currentPage: 1,
  totalItems: mockReports.length,
}

const fetchReportsMock = vi.hoisted(() => vi.fn(() => Promise.resolve(mockApiResponse)))

vi.mock('@entities/services/reporting', () => ({
  fetchAvailableReports: fetchReportsMock,
}))

const createWrapper = (options = {}) =>
  shallowMount(BiReportsList, {
    global: {
      stubs: {
        ReportTable: true,
        PPagination: {
          name: 'PPagination',
          template: '<div class="p-pagination"><slot /></div>',
          props: ['pCurrentPage', 'pTotal', 'pPageSizes', 'pShowTotalPageCounter'],
        },
      },
    },
    ...options,
  })

describe('BiReportsList', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })

  describe('Rendering', () => {
    it('renders the ReportTable component', () => {
      const table = wrapper.findComponent({ name: 'ReportTable' })
      expect(table.exists()).toBe(true)
    })

    it('renders the PPagination component with correct props', () => {
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      expect(pagination.exists()).toBe(true)
      expect(pagination.props('pCurrentPage')).toBe(mockApiResponse.currentPage)
      expect(pagination.props('pTotal')).toBe(mockApiResponse.totalItems)
    })

    it('displays the pagination label', () => {
      expect(wrapper.text()).toContain('on')
    })
  })

  describe('Pagination Events', () => {
    it('fetches new reports when current page changes', async () => {
      const newPage = 3
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      pagination.vm.$emit('update:p-current-page', newPage)
      await nextTick()

      expect(fetchReportsMock).toHaveBeenCalledTimes(2)
      expect(fetchReportsMock).toHaveBeenLastCalledWith({
        pageNumber: newPage,
        pageSize: PAGE_SIZES[0],
      })
    })

    it('fetches new reports when page size changes', async () => {
      const newPageSize = PAGE_SIZES[1]
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      pagination.vm.$emit('on-page-range-changed', newPageSize)
      await nextTick()

      expect(fetchReportsMock).toHaveBeenCalledTimes(2)
      expect(fetchReportsMock).toHaveBeenLastCalledWith({
        pageNumber: 1,
        pageSize: newPageSize,
      })
    })
  })
})
