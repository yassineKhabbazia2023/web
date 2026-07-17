import { ReportStatus } from '@powerbi/enums/bi-reports.enum'
import type { ReportQueryParams, ReportStatusTag, ReportTableRow } from '@powerbi/types/bi-reports.types'
import { getMockReportTable } from '@powerbi/__mocks__/bi-report.mocks'
import { getAvatarColorFromKey } from '@pulse/styleguide'

import { getMappedReport, getReportsQueryParams } from './power-bi.utils'

// getAvatarColorFromKey is swapped for the shared spy by the '@pulse/styleguide'
// hub in vitest.setup.ts: the mapping is armed per test (doctrine: shared-hubs).

describe('getMappedReport', () => {
  it('should map reports correctly with avatarColor and status tag', () => {
    vi.mocked(getAvatarColorFromKey)
      .mockReturnValueOnce('amethyste')
      .mockReturnValueOnce('persian-light')

    const reports: ReportTableRow[] = getMockReportTable()?.splice(0, 2)

    const reportStatus: Record<ReportStatus, ReportStatusTag> = {
      [ReportStatus.ONLINE]: { type: ReportStatus.ONLINE, text: 'Online', color: 'success', iconName: 'checkCircle' },
      [ReportStatus.OFFLINE]: { type: ReportStatus.OFFLINE, text: 'Offline', color: 'gray', iconName: 'eyeSlash' },
      [ReportStatus.FAILED]: { type: ReportStatus.FAILED, text: 'Failure', color: 'danger', iconName: 'exclamationTriangle' },
      [ReportStatus.PENDING_VALIDATION]: { type: ReportStatus.PENDING_VALIDATION, text: 'Pending validation', color: 'warning', iconName: 'clock' },
    }

    const result = getMappedReport(reports, reportStatus)

    expect(result).toStrictEqual([
      {
        ...reports[0],
        status: reportStatus[ReportStatus.ONLINE],
        avatarColor: 'amethyste',
      },
      {
        ...reports[1],
        status: reportStatus[ReportStatus.OFFLINE],
        avatarColor: 'persian-light',
      },
    ])
    expect(vi.mocked(getAvatarColorFromKey)).toHaveBeenNthCalledWith(1, reports[0].accountNumber)
    expect(vi.mocked(getAvatarColorFromKey)).toHaveBeenNthCalledWith(2, reports[1].accountNumber)
  })
})

describe('getReportsQueryParams', () => {
  it('should return cleaned query params without falsy values', () => {
    const input: ReportQueryParams = {
      currentPage: 1,
      limit: 25,
      search: '',
      sorting: {
        descending: false,
        field: '',
      },
    }

    const result = getReportsQueryParams(input)

    expect(result).toEqual({
      pageNumber: 1,
      pageSize: 25,
    })
  })

  it('should return full object if all values are truthy', () => {
    const input: ReportQueryParams = {
      currentPage: 2,
      limit: 50,
      search: 'marketing',
      sorting: {
        descending: false,
        field: '',
      },
    }

    const result = getReportsQueryParams(input)

    expect(result).toEqual({
      pageNumber: 2,
      pageSize: 50,
      search: 'marketing',
    })
  })
})
