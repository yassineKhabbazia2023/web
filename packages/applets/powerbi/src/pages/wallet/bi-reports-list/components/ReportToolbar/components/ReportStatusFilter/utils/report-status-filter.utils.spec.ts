import { ReportStatus } from '@powerbi/enums/bi-reports.enum'
import { getMockReportStatistics } from '@powerbi/__mocks__/bi-report.mocks'
import { getReportStatusFilter } from './report-status-filter.utils'

const reportStatisticsMock = getMockReportStatistics()
const reportStatisticsLabelsMock = {
  failed: 'Failed',
  offline: 'Offline',
  online: 'Online',
}

const expectedFilters = [
  {
    key: 'failed',
    status: ReportStatus.FAILED,
    label: 'Failed',
    color: 'danger',
    icon: 'exclamationTriangle',
    value: reportStatisticsMock.failed,
  },
  {
    key: 'offline',
    status: ReportStatus.OFFLINE,
    label: 'Offline',
    color: 'gray',
    icon: 'eyeSlash',
    value: reportStatisticsMock.offline,
  },
  {
    key: 'online',
    status: ReportStatus.ONLINE,
    label: 'Online',
    color: 'success',
    icon: 'checkCircle',
    value: reportStatisticsMock.online,
  },
]

describe('getReportStatusFilters', () => {
  it.each(expectedFilters)(
    'should return correct filter object for status "$key"',
    ({ status, label, color, icon, value }) => {
      const filters = getReportStatusFilter(reportStatisticsLabelsMock, reportStatisticsMock)
      const filter = filters.find((f) => f.pCode === status)

      expect(filter).toBeDefined()
      expect(filter).toMatchObject({
        pContent: label,
        pCode: status,
        pValue: value,
        pColor: color,
        pIconName: icon,
      })
    },
  )

  it('should return filters with undefined values if reportStatistics is not provided', () => {
    const filters = getReportStatusFilter(reportStatisticsLabelsMock)

    filters.forEach((filter) => {
      expect(filter.pValue).toBeUndefined()
    })
  })
})
