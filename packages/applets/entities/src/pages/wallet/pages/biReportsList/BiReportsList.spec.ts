import { nextTick } from 'vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'
import { PAGE_SIZES } from '@entities/constants'
import { getFormattedMockReports } from '@entities/__mocks__/bi-report.mocks'
import { ReportStatus } from '@entities/common/types/BIReports.enums'

import BiReportsList from '.'

const mockReports = getFormattedMockReports()
const mockApiResponse = {
  items: mockReports,
  currentPage: 1,
  totalItems: mockReports.length,
}

const displayNotificationMock = vi.hoisted(() => vi.fn())
const updateReportStatusMock = vi.hoisted(() => vi.fn(() => Promise.resolve()))
const fetchReportsMock = vi.hoisted(() => vi.fn(() => Promise.resolve(mockApiResponse)))

vi.mock('@entities/services/reporting', () => ({
  fetchAvailableReports: fetchReportsMock,
  updateReportStatus: updateReportStatusMock,
}))

vi.mock('@entities/common/utils', () => ({
  displayNotification: displayNotificationMock,
}))

const createWrapper = (options = {}) =>
  shallowMount(BiReportsList, {
    global: {
      stubs: {
        PLoader: {
          template: '<div data-testid="loader">Loading...</div>',
        },
        ReportTable: {
          name: 'ReportTable',
          template: '<div />',
          emits: ['update-report-status'],
        },
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

  describe('Status Update Events', () => {
    it('handles update-report-status and calls updateReportStatus service', async () => {
      const report = mockReports[0]
      const table = wrapper.findComponent({ name: 'ReportTable' })

      await table.vm.$emit('update-report-status', report.accountId, report.reportId, report.name, ReportStatus.OFFLINE)
      await flushPromises()

      expect(updateReportStatusMock).toHaveBeenCalledWith(report.accountId, report.reportId, ReportStatus.OFFLINE)
      expect(displayNotificationMock).toHaveBeenCalledWith('success', expect.stringContaining(report.name))
    })

    it('displays error notification when updateReportStatus fails', async () => {
      updateReportStatusMock.mockRejectedValueOnce(new Error('fail'))

      const report = mockReports[0]
      const table = wrapper.findComponent({ name: 'ReportTable' })

      await table.vm.$emit('update-report-status', report.accountId, report.reportId, report.name, ReportStatus.ONLINE)
      await flushPromises()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', expect.stringContaining('activating'))
    })

    it('displays error notification when fetchAvailableReports fails', async () => {
      fetchReportsMock.mockRejectedValueOnce(new Error('fail'))

      wrapper = createWrapper()
      await flushPromises()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', expect.stringContaining("couldn't load"))
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
