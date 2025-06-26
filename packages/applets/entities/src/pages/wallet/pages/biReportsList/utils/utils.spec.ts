import { ReportStatus } from '@entities/common/types/BIReports.enums'
import type { ReportSearchCriteria, ReportStatusTag, ReportTableRow } from '@entities/common/types/BIReportsTypes'
import { getMockReportTable } from '@entities/__mocks__/bi-report.mocks'

import { getMappedReport, getReportsQueryParams } from '.'

vi.mock('@pulse/styleguide', () => ({
  getAvatarColorFromKey: vi.fn((key: string) => `color-${key}`),
}))

describe('getMappedReport', () => {
  it('should map reports correctly with avatarColor and status tag', () => {
    const reports: ReportTableRow[] = getMockReportTable()?.splice(0, 2)

    const reportStatus: Record<ReportStatus, ReportStatusTag> = {
      [ReportStatus.ONLINE]: { type: ReportStatus.ONLINE, text: 'Online', color: 'success', iconName: 'checkCircle' },
      [ReportStatus.OFFLINE]: { type: ReportStatus.OFFLINE, text: 'Offline', color: 'gray-900', iconName: 'eyeSlash' },
      [ReportStatus.INITIALIZED]: { type: ReportStatus.INITIALIZED, text: 'Initialized', color: 'info', iconName: 'stars' },
      [ReportStatus.FAILED]: { type: ReportStatus.FAILED, text: 'Failure', color: 'danger', iconName: 'exclamationTriangle' },
    }

    const result = getMappedReport(reports, reportStatus)

    expect(result).toStrictEqual([
      {
        ...reports[0],
        status: reportStatus[ReportStatus.ONLINE],
        avatarColor: `color-${reports[0].accountNumber}`,
      },
      {
        ...reports[1],
        status: reportStatus[ReportStatus.OFFLINE],
        avatarColor: `color-${reports[1].accountNumber}`,
      },
    ])
  })
})

describe('getReportsQueryParams', () => {
  it('should return cleaned query params without falsy values', () => {
    const input: ReportSearchCriteria = {
      currentPage: 1,
      limit: 25,
      search: '',
    }

    const result = getReportsQueryParams(input)

    expect(result).toEqual({
      pageNumber: 1,
      pageSize: 25,
    })
  })

  it('should return full object if all values are truthy', () => {
    const input: ReportSearchCriteria = {
      currentPage: 2,
      limit: 50,
      search: 'marketing',
    }

    const result = getReportsQueryParams(input)

    expect(result).toEqual({
      pageNumber: 2,
      pageSize: 50,
      search: 'marketing',
    })
  })
})
