import type { ReportInfo } from '@powerbi/types/bi-reports.types'
import type { PDropdownOption } from '@pulse/styleguide/types'

export interface BIReportInformationProps {
  reportTypes: PDropdownOption[]
  reportUploadInfo: ReportInfo
}
