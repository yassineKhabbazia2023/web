import { ReportTypeEnum, ReportTypeLabelEnum } from '@powerbi/enums/bi-reports.enum'
import type { ReportTypeTag } from '@powerbi/types/bi-reports.types'

export const REPORT_TYPES: Record<ReportTypeEnum, ReportTypeTag> = {
  [ReportTypeEnum.LOOP]: { text: ReportTypeLabelEnum.LOOP, iconName: 'loopColor' },
  [ReportTypeEnum.SILAE]: { text: ReportTypeLabelEnum.SILAE, iconName: 'silaeColor' },
  [ReportTypeEnum.FORMS]: { text: ReportTypeLabelEnum.FORMS, iconName: 'clipboardData' },
  [ReportTypeEnum.PAYFIT]: { text: ReportTypeLabelEnum.PAYFIT, iconName: 'payfit' },
  [ReportTypeEnum.PENNYLANE]: { text: ReportTypeLabelEnum.PENNYLANE, iconName: 'pennylaneColor' },
  [ReportTypeEnum.ESC]: { text: ReportTypeLabelEnum.ESC, iconName: 'clipboardData' },
  [ReportTypeEnum.RH]: { text: ReportTypeLabelEnum.RH, iconName: 'clipboardData' },
  [ReportTypeEnum.AUT]: { text: ReportTypeLabelEnum.AUT, iconName: 'clipboardData' },
  [ReportTypeEnum.UNKNOWN]: { text: ReportTypeLabelEnum.UNKNOWN, iconName: 'clipboardData' },
}
