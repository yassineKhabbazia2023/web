import { it, describe, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import * as reportingServices from '@/services/reporting'
import { getMockedBIReports } from './BIReportsMocks'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import BIReports from '.'

// Mocks
const mockedAccountId = 602
const mockedBIReports = getMockedBIReports()
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: mockedAccountId,
    },
  }),
}))
vi.mock('@/services/reporting', () => ({
  fetchBIReports: vi.fn(() => Promise.resolve({ items: mockedBIReports })),
  fetchBIToken: vi.fn(() => 'tokenTest'),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(BIReports, { plugins: [createTestingPinia()] })

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
    it('should display a console error if the request to fetch the BI reports fails', async () => {
      const spyConsole = vi.spyOn(console, 'error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(reportingServices, 'fetchBIReports').mockRejectedValue(
        expectedErrorMessage,
      )
      createWrapper()
      await flushPromises()

      expect(spyConsole).toHaveBeenCalledOnce()
      expect(spyConsole).toHaveBeenCalledWith(
        'Unable to fetch BI reports: ',
        expectedErrorMessage,
      )
    })
  })
})
