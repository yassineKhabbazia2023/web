import type { ReportInfo } from '../../SubmitBIReportTypes'
import type { PDropdownOption } from '@pulse/styleguide'

export interface BIReportInformationProps {
  reportTypes: PDropdownOption[]
  reportUploadInfo: ReportInfo
}
