import { describe, it, expect } from 'vitest'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import type { ReportStatusTag, ReportTableRow } from '@entities/common/types/BIReportsTypes'
import { getMockReportTable } from '@entities/__mocks__/bi-report.mocks'

import { getMappedReport } from '.'

vi.mock('@pulse/styleguide', () => ({
  getAvatarColorFromKey: vi.fn((key: string) => `color-${key}`),
}))

describe('getMappedReport', () => {
  it('should map reports correctly with avatarColor and status tag', () => {
    const reports: ReportTableRow[] = getMockReportTable()?.splice(0, 2)

    const reportStatus: Record<ReportStatus, ReportStatusTag> = {
      [ReportStatus.ONLINE]: { text: 'Online', color: 'success', iconName: 'checkCircle' },
      [ReportStatus.OFFLINE]: { text: 'Offline', color: 'gray-900', iconName: 'eyeSlash' },
      [ReportStatus.INITIALIZED]: { text: 'Initialized', color: 'info', iconName: 'stars' },
      [ReportStatus.FAILED]: { text: 'Failure', color: 'danger', iconName: 'exclamationTriangle' },
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
