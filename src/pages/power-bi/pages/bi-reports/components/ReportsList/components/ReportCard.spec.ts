import { expect, it, describe, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ReportCard from '.'

// Mocks
const mockedReportName = 'Test Report'
const mockedReportType = 'Test Report Type'

// Expectations
const expectedReportUpdatedOn = 'Updated on 5/30/2024'

const createWrapper = (): VueWrapper<any> => {
  return mount(ReportCard, {
    props: {
      name: mockedReportName,
      type: mockedReportType,
      updatedDate: '2024-05-30T09:53:43.68',
    },
  })
}

describe('reportCard', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the report card', () => {
      const reportName = wrapper.find('[data-testid=report-card-name]')
      const reportType = wrapper.findComponent({ name: 'PTag' })
      const reportUpdatedOn = wrapper.find(
        '[data-testid=report-card-updated-on]',
      )

      expect(reportType.exists()).toBeTruthy()
      expect(reportName.text()).toBe(mockedReportName)
      expect(reportUpdatedOn.text()).toBe(expectedReportUpdatedOn)
    })
  })
  describe('events', () => {
    it("should emit 'select-report' when clicking on card", async () => {
      await wrapper.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('select-report')
    })
  })
})
