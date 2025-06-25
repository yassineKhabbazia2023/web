import { it, expect, describe, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { getMockedBIReports } from '@entities/__mocks__/bi-report.mocks'
import type { ReportsListProps } from './ReportsListTypes'

import ReportsList from '.'

// Mocks
const reportsMock = getMockedBIReports()

// Expectations
const expectedReportsTitle = 'BI reports deposited'

const defaultProps: ReportsListProps = {
  reports: reportsMock,
  selectedReport: reportsMock[0],
}

const createWrapper = (overridenProps: Partial<ReportsListProps> = {}) => {
  return shallowMount(ReportsList, {
    props: {
      ...defaultProps,
      ...overridenProps,
    },
    global: {
      stubs: {
        PScrollbar: {
          name: 'PScrollbar',
          template: '<div><slot/></div>',
        },
        ReportCard: {
          name: 'ReportCard',
          template: '<div></div>',
          props: ['name', 'updatedDate', 'type', 'isSelected'],
          emits: ['select-report'],
        },
      },
    },
  })
}

describe('reportsList', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the list of reports', () => {
      const reportsTitle = wrapper.find('[data-testid=reports-list-title]')
      const reportCards = wrapper.findAllComponents({ name: 'ReportCard' })

      expect(reportsTitle.text()).toBe(expectedReportsTitle)
      expect(reportCards).toHaveLength(reportsMock.length)
    })
  })
  describe('events', () => {
    it("should emit 'select-report' when a report is selected", () => {
      // Arrange
      const firstReportCard = wrapper.findComponent({ name: 'ReportCard' })

      // Act
      firstReportCard.vm.$emit('select-report')

      // Assert
      expect(wrapper.emitted('select-report')).toStrictEqual([[reportsMock[0].reportId]])
    })
  })
})
