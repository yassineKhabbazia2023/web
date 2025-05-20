import type { PTagProps } from '@pulse/styleguide/types'
import { ReportStatus } from './BIReports.enums'

export interface ReportStatusTag {
  text: string
  type: ReportStatus
  color: PTagProps['pColor']
  iconName: PTagProps['pIconLeftName']
}

export interface ReportType {
  reportTypeId: number
  name: string
  collaboratorLabel: string
  customerLabel: string
}

export interface Report {
  accountId: number
  reportId: number
  reportLabel: string
  documentName: string
  embededReportUrl: string
  embededReportId: string
  name: string
  createdBy: string
  creationDate?: string
  type: ReportType
  updateDate?: string
  dataUpdateDate?: string
}

type BaseReportExcludes = 'documentName' | 'embededReportId' | 'embededReportUrl';

export interface ReportTableRow extends Omit<Report, BaseReportExcludes> {
  embedReportId: string
  embedReportUrl: string
  typeLabel: string
  accountNumber: string
  legalName: string
  status: ReportStatus
}

export interface MappedReportRow extends Omit<ReportTableRow, 'status'> {
  status: ReportStatusTag,
  avatarColor: string
}
