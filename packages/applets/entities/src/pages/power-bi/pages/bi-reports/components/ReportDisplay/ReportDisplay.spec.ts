
import '@entities/__mocks__/common.import.mocks'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import * as reportingServices from '@entities/services/reporting'
import * as commonUtils from '@entities/common/utils'
import { getMockedBIReports } from '@entities/__mocks__/bi-report.mocks'
import { getStoreMock } from '@pulse/common/mocks'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'

import ReportDisplay from '.'

// Mocks
const mockedSelectedReport = getMockedBIReports()[0]
const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

// @ts-ignore
window.powerbi = {
  reset: () => vi.fn(),
  embed: () => vi.fn(),
} as any
vi.mock('powerbi-client', () => ({
  powerBiEmbed: () => vi.fn(),
}))

const createWrapper = (): VueWrapper => {
  return mount(ReportDisplay, {
    props: {
      selectedReport: mockedSelectedReport,
      token: 'tokenTest',
    },
  })
}

describe('reportDisplay', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    selectedEntityStoreMock.selectedEntity = mockedEntity
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should display the Power BI iframe correctly with the account name', () => {
      const accountName = wrapper.find(
        '[data-testid=report-display-account-name]',
      )
      const powerbiIframe = wrapper.find('[data-testid=report-display-iframe]')

      expect(powerbiIframe.exists()).toBeTruthy()
      expect(accountName.text()).toBe('Entity Test')
    })
  })
  describe('events', () => {
    it('should call the reporting API with the correct parameters to fetch the token of the selected report', () => {
      const fetchBITokenSpy = vi.spyOn(reportingServices, 'fetchBIToken')
      createWrapper()

      expect(fetchBITokenSpy).toHaveBeenCalledOnce()
      expect(fetchBITokenSpy).toHaveBeenCalledWith(mockedSelectedReport.embededReportId, mockedSelectedReport.accountId)
    })
    it('should display an error notification if the request to fetch the BI reports fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(reportingServices, 'fetchBIToken').mockRejectedValue(expectedErrorMessage)
      const displayNotificationSpy = vi.spyOn(commonUtils, 'displayNotification')
      createWrapper()
      await flushPromises()

      expect(displayNotificationSpy).toHaveBeenCalledOnce()
      expect(displayNotificationSpy).toHaveBeenCalledWith(
        'error',
        "The BI report can't be loaded at the moment. Please try again later.",
      )
    })
  })
})
