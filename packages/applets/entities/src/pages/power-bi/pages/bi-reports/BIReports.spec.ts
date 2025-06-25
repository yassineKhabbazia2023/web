import { it, describe, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { loggerMock } from '@pulse/core/mocks'
import * as reportingServices from '@entities/services/reporting'
import * as commonUtils from '@entities/common/utils'
import { getMockedBIReports } from '@entities/__mocks__/bi-report.mocks'
import { nextTick } from 'vue'
import { RouteParam } from '@pulse/common/enums'

import BIReports from '.'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const accountIdMock = 602
const reportsMock = getMockedBIReports()
const routerReplaceMock = vi.fn()
const routeQueryMock = vi.hoisted(() => vi.fn(() => ({ query: { reportId: reportsMock[0].reportId } })))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: routerReplaceMock,
  }),
  useRoute: () => ({
    params: {
      [RouteParam.ENTITY_ID]: accountIdMock,
    },
    query: routeQueryMock,
  }),
}))
vi.mock('@entities/services/reporting', () => ({
  fetchBIReports: vi.fn(() => Promise.resolve({ items: reportsMock })),
  fetchBIToken: vi.fn(() => 'tokenTest'),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(BIReports, {
    global: {
      stubs: {
        PLoader: true,
        ReportsList: true,
        ReportDisplay: true,
      },
    },
  })

describe('biReports', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should display the BI reports correctly', () => {
      const reportsList = wrapper.findComponent({ name: 'ReportsList' })
      const reportDisplay = wrapper.findComponent({ name: 'ReportDisplay' })

      expect(reportsList.exists()).toBeTruthy()
      expect(reportDisplay.exists()).toBeTruthy()
      expect(reportsList.props('selectedReport')).toStrictEqual(reportsMock[0])
    })
  })
  describe('routing', () => {
    it('clears router query when selecting an invalid report', async () => {
      // select invalid report ID
      const reportList = wrapper.findComponent({ name: 'ReportsList' })
      reportList.vm.$emit('select-report', 999)
      await nextTick()

      expect(routerReplaceMock).toHaveBeenCalledWith({ query: {} })
      expect(loggerMock.warn).toHaveBeenCalledOnce()
      expect(loggerMock.warn).toHaveBeenCalledWith('Invalid reportId provided. Resetting to the first available report.')
    })
    it('updates the reportId in the query when a different report is selected', async () => {
      // Arrange
      const reportList = wrapper.findComponent({ name: 'ReportsList' })

      // Act: simulate user selecting the second report
      reportList.vm.$emit('select-report', reportsMock[1].reportId)
      await nextTick()

      // Assert: router should be called with updated reportId
      expect(routerReplaceMock).toHaveBeenNthCalledWith(2, {
        // First call on mounted, second call on report selection
        query: { reportId: reportsMock[1].reportId },
      })
    })
  })
  describe('events', () => {
    it("should update 'selectedReports' when ReportsList emits 'select-report'", async () => {
      const reportsList = wrapper.findComponent({ name: 'ReportsList' })
      reportsList.vm.$emit('select-report', reportsMock[1].reportId)
      await nextTick()
      const selectedReport = wrapper.vm.selectedReport

      expect(selectedReport).toStrictEqual(reportsMock[1])
    })
    it('should select the first report by default', () => {
      const selectedReport = wrapper.vm.selectedReport

      expect(selectedReport).toStrictEqual(reportsMock[0])
    })
    it('should call the reporting API with the correct parameters to fetch the reports related to an account', () => {
      const spyFetchBIReports = vi.spyOn(reportingServices, 'fetchBIReports')
      createWrapper()

      expect(spyFetchBIReports).toHaveBeenCalledOnce()
      expect(spyFetchBIReports).toHaveBeenCalledWith(accountIdMock)
    })
    it('should display an error notification if the request to fetch the BI reports fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(reportingServices, 'fetchBIReports').mockRejectedValue(expectedErrorMessage)
      const displayNotificationSpy = vi.spyOn(commonUtils, 'displayNotification')
      createWrapper()
      await flushPromises()

      expect(displayNotificationSpy).toHaveBeenCalledOnce()
      expect(displayNotificationSpy).toHaveBeenCalledWith(
        'error',
        "There's a technical issue with fetching BI reports. Please check back later.",
      )
    })
  })
})
