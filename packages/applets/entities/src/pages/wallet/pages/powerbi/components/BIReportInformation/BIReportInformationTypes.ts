import type { ReportInfo } from '../../SubmitBIReportTypes'
import type { PDropdownOption } from '@pulse/styleguide/types'

export interface BIReportInformationProps {
  reportTypes: PDropdownOption[]
  reportUploadInfo: ReportInfo
}
