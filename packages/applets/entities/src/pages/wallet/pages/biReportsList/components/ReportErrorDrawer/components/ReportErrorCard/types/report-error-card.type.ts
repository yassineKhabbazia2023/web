import { ReportTypeEnum } from '@entities/common/types/BIReports.enums'
import type { PTagProps } from '@pulse/styleguide/types'

export interface ReportErrorCardProps {
  reportName: string
  embedReportId: string
  reportType: ReportTypeEnum
  messages: string[]
  detectionDate: string
}

export interface ReportTypeTag {
  text: string
  iconName?: PTagProps['pIconLeftName']
}
