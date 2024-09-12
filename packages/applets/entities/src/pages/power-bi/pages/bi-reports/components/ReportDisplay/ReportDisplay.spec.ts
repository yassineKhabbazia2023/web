import { it, describe, beforeEach, expect } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { getMockedBIReports } from '../../BIReportsMocks'
import ReportDisplay from '.'

// Mocks
const mockedSelectedReport = getMockedBIReports()[0]

const createWrapper = (): VueWrapper => {
  return mount(ReportDisplay, {
    props: {
      selectedReport: mockedSelectedReport,
      token: 'tokenTest',
    },
    plugins: [createTestingPinia()],
  })
}

describe('reportDisplay', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
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
})
