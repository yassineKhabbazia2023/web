import type { ReportInfo } from '../../SubmitBIReportTypes'
import type { PDropdownOption } from '@kpmg/styleguide'

export interface BIReportInformationProps {
  reportTypes: PDropdownOption[]
  reportUploadInfo: ReportInfo
}
