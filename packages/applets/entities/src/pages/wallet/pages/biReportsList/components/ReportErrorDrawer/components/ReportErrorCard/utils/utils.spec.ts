import { ReportTypeEnum, ReportTypeText } from '@entities/common/types/BIReports.enums'
import { ReportTypeTag } from '../types/report-error-card.type'
import { getReportTypeTag } from '.'

const REPORT_TYPES: Record<string, ReportTypeTag> = {
  [ReportTypeEnum.LOOP]: { text: ReportTypeText.LOOP, iconName: 'loopColor' },
  [ReportTypeEnum.SILAE]: { text: ReportTypeText.SILAE, iconName: 'silaeColor' },
  [ReportTypeEnum.FORMS]: { text: ReportTypeText.FORMS, iconName: 'clipboardData' },
  [ReportTypeEnum.PAYFIT]: { text: ReportTypeText.PAYFIT, iconName: 'payfit' },
  [ReportTypeEnum.PENNYLANE]: { text: ReportTypeText.PENNYLANE, iconName: 'pennylaneColor' },
  [ReportTypeEnum.ESC]: { text: ReportTypeText.ESC, iconName: 'clipboardData' },
  [ReportTypeEnum.RH]: { text: ReportTypeText.RH, iconName: 'clipboardData' },
  [ReportTypeEnum.AUT]: { text: ReportTypeText.AUT, iconName: 'clipboardData' },
  [ReportTypeEnum.UNKNOWN]: { text: ReportTypeText.UNKNOWN, iconName: 'clipboardData' },
}

describe('getReportTypeTag()', () => {
  it('should get report tag with image correctly', () => {
    const result = getReportTypeTag(REPORT_TYPES, ReportTypeEnum.LOOP)

    expect(result).toStrictEqual({
      text: ReportTypeText.LOOP,
      iconName: 'loopColor',
    })
  })

  it('should get report tag with icon correctly', () => {
    const result = getReportTypeTag(REPORT_TYPES, ReportTypeEnum.FORMS)

    expect(result).toStrictEqual({
      text: ReportTypeText.FORMS,
      iconName: 'clipboardData',
    })
  })
})
