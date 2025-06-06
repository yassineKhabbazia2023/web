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

const mockedAccountId = 602
const mockedBIReports = getMockedBIReports()

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      [RouteParam.ENTITY_ID]: mockedAccountId,
    },
  }),
}))
vi.mock('@entities/services/reporting', () => ({
  fetchBIReports: vi.fn(() => Promise.resolve({ items: mockedBIReports })),
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
      expect(reportsList.props('selectedReport')).toStrictEqual(
        mockedBIReports[0],
      )
    })
  })
  describe('events', () => {
    it("should update 'selectedReports' when ReportsList emits 'update:selectedReport'", async () => {
      const reportsList = wrapper.findComponent({ name: 'ReportsList' })
      reportsList.vm.$emit('update:selectedReport', mockedBIReports[1])
      await nextTick()
      const selectedReport = wrapper.vm.selectedReport

      expect(selectedReport).toStrictEqual(mockedBIReports[1])
    })
    it('should select the first report by default', () => {
      const selectedReport = wrapper.vm.selectedReport

      expect(selectedReport).toStrictEqual(mockedBIReports[0])
    })
    it('should call the reporting API with the correct parameters to fetch the reports related to an account', () => {
      const spyFetchBIReports = vi.spyOn(reportingServices, 'fetchBIReports')
      createWrapper()

      expect(spyFetchBIReports).toHaveBeenCalledOnce()
      expect(spyFetchBIReports).toHaveBeenCalledWith(mockedAccountId)
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
