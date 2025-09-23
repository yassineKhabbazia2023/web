import { ReportTypeEnum, ReportTypeLabelEnum } from '@powerbi/enums/bi-reports.enum'
import { REPORT_TYPES } from '@powerbi/constants/report-types.const'

import { getReportTypeTag } from './report-error-card.utils'

describe('getReportTypeTag', () => {
  it.each([
    [ReportTypeEnum.LOOP, { text: ReportTypeLabelEnum.LOOP, iconName: 'loopColor' }],
    [ReportTypeEnum.SILAE, { text: ReportTypeLabelEnum.SILAE, iconName: 'silaeColor' }],
    [ReportTypeEnum.FORMS, { text: ReportTypeLabelEnum.FORMS, iconName: 'clipboardData' }],
    [ReportTypeEnum.PAYFIT, { text: ReportTypeLabelEnum.PAYFIT, iconName: 'payfit' }],
    [ReportTypeEnum.PENNYLANE, { text: ReportTypeLabelEnum.PENNYLANE, iconName: 'pennylaneColor' }],
    [ReportTypeEnum.ESC, { text: ReportTypeLabelEnum.ESC, iconName: 'clipboardData' }],
    [ReportTypeEnum.RH, { text: ReportTypeLabelEnum.RH, iconName: 'clipboardData' }],
    [ReportTypeEnum.AUT, { text: ReportTypeLabelEnum.AUT, iconName: 'clipboardData' }],
    [ReportTypeEnum.UNKNOWN, { text: ReportTypeLabelEnum.UNKNOWN, iconName: 'clipboardData' }],
  ])('returns correct tag config for %s', (type, expected) => {
    const result = getReportTypeTag(REPORT_TYPES, type)
    expect(result).toEqual(expected)
  })
})
