import { it, expect, describe, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { getMockedBIReports } from '../../BIReportsMocks'
import ReportsList from '.'

// Mocks
const mockedReports = getMockedBIReports()

// Expectations
const expectedReportsTitle = 'BI reports deposited'

const createWrapper = (): VueWrapper<any> => {
  return mount(ReportsList, {
    props: {
      reports: mockedReports,
      selectedReport: mockedReports[0],
    },
  })
}

describe('reportsList', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the list of reports', () => {
      const reportsTitle = wrapper.find('[data-testid=reports-list-title]')
      const reportCards = wrapper.findAllComponents({ name: 'ReportCard' })

      expect(reportsTitle.text()).toBe(expectedReportsTitle)
      expect(reportCards).toHaveLength(mockedReports.length)
    })
  })
  describe('events', () => {
    it("should emit 'update:selectedReport' when a report is selected", () => {
      const firstReportCard = wrapper.findComponent({ name: 'ReportCard' })
      firstReportCard.vm.$emit('select-report')

      expect(wrapper.emitted('update:selectedReport')).toStrictEqual([
        [mockedReports[0]],
      ])
    })
  })
})
