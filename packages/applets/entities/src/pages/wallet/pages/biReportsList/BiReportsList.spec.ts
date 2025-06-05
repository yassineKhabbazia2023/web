import { nextTick } from 'vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'
import { PAGE_SIZES } from '@entities/constants'
import { getFormattedMockReports } from '@entities/__mocks__/bi-report.mocks'
import { ReportStatus } from '@entities/common/types/BIReports.enums'

import BiReportsList from '.'

const reportsMock = getFormattedMockReports()
const firstReportMock = reportsMock[0]
const tokenMock = 'fake-token'
const apiResponseMock = {
  items: reportsMock,
  currentPage: 1,
  totalItems: reportsMock.length,
}

const displayNotificationMock = vi.hoisted(() => vi.fn())
const updateReportStatusMock = vi.hoisted(() => vi.fn(() => Promise.resolve()))
const fetchBITokenMock = vi.hoisted(() => vi.fn(() => Promise.resolve(tokenMock)))
const fetchReportsMock = vi.hoisted(() => vi.fn(() => Promise.resolve(apiResponseMock)))

vi.mock('@entities/services/reporting', () => ({
  fetchAvailableReports: fetchReportsMock,
  updateReportStatus: updateReportStatusMock,
  fetchBIToken: fetchBITokenMock,
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
          emits: ['update-report-status', 'view-report-fullscreen'],
        },
        ReportToolbar: {
          name: 'ReportToolbar',
          template: '<div />',
          emits: ['search-report'],
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
      expect(pagination.props('pCurrentPage')).toBe(apiResponseMock.currentPage)
      expect(pagination.props('pTotal')).toBe(apiResponseMock.totalItems)
    })

    it('displays the pagination label', () => {
      expect(wrapper.text()).toContain('on')
    })
  })

  describe('Status Update Events', () => {
    it('handles update-report-status and calls updateReportStatus service', async () => {
      const table = wrapper.findComponent({ name: 'ReportTable' })

      await table.vm.$emit(
        'update-report-status',
        firstReportMock.accountId,
        firstReportMock.reportId,
        firstReportMock.name,
        ReportStatus.OFFLINE,
      )
      await flushPromises()

      expect(updateReportStatusMock).toHaveBeenCalledWith(
        firstReportMock.accountId,
        firstReportMock.reportId,
        ReportStatus.OFFLINE,
      )
      expect(displayNotificationMock).toHaveBeenCalledWith('success', expect.stringContaining(firstReportMock.name))
    })

    it('displays error notification when updateReportStatus fails', async () => {
      updateReportStatusMock.mockRejectedValueOnce(new Error('fail'))

      const table = wrapper.findComponent({ name: 'ReportTable' })

      await table.vm.$emit(
        'update-report-status',
        firstReportMock.accountId,
        firstReportMock.reportId,
        firstReportMock.name,
        ReportStatus.ONLINE,
      )
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

  describe('View Report', () => {
    it('opens fullscreen when view-report-fullscreen event is emitted', async () => {
      const reportTable = wrapper.findComponent({ name: 'ReportTable' })
      await reportTable.vm.$emit(
        'view-report-fullscreen',
        firstReportMock.accountId,
        firstReportMock.name,
        firstReportMock.embedReportId,
        firstReportMock.embedReportUrl,
      )

      await flushPromises()

      const powerBIViewer = wrapper.findComponent({ name: 'PowerBIReportViewer' })

      expect(powerBIViewer.props('modelValue')).toBe(true)
      expect(powerBIViewer.props('reportLabel')).toBe(firstReportMock.name)
      expect(powerBIViewer.props('powerBIConfig')).toMatchObject({
        uniqueId: firstReportMock.embedReportId,
        embedUrl: firstReportMock.embedReportUrl,
        accessToken: tokenMock,
      })
    })

    it('calls fetchBIToken with correct params on view-report-fullscreen', async () => {
      const reportTable = wrapper.findComponent({ name: 'ReportTable' })
      await reportTable.vm.$emit(
        'view-report-fullscreen',
        firstReportMock.accountId,
        firstReportMock.name,
        firstReportMock.embedReportId,
        firstReportMock.embedReportUrl,
      )

      await flushPromises()

      expect(fetchBITokenMock).toHaveBeenCalledTimes(1)
      expect(fetchBITokenMock).toHaveBeenCalledWith(firstReportMock.embedReportId, firstReportMock.accountId)
    })
  })

  describe('Search Integration', () => {
    it("triggers data fetch with search term when 'search-report' is emitted", async () => {
      // Arrange
      const searchedReport = 'Test Report'
      const reportHeader = wrapper.findComponent({ name: 'ReportToolbar' })

      // Act
      reportHeader.vm.$emit('search-report', searchedReport)

      // Assert
      expect(fetchReportsMock).toHaveBeenCalledTimes(2) // onMounted and search emit = 2
      expect(fetchReportsMock).toHaveBeenLastCalledWith({
        pageNumber: 1,
        search: searchedReport,
        pageSize: PAGE_SIZES[0],
      })
    })
    it('does not trigger data fetch if search input is empty or unchanged', async () => {
      // Arrange
      const emptySearch = ''
      const reportHeader = wrapper.findComponent({ name: 'ReportToolbar' })

      // Act
      reportHeader.vm.$emit('search-report', emptySearch)

      // Assert
      expect(fetchReportsMock).toHaveBeenCalledTimes(1) // Only initial fetch (onMounted)
    })
  })
})
