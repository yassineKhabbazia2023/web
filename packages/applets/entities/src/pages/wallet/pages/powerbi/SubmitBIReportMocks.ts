import type { ReportType } from '@entities/pages/power-bi/pages/bi-reports/BIReportsTypes'
import type { PDropdownOption } from '@kpmg/styleguide'

export const getMockedReportTypesDropdown = (): PDropdownOption[] => [
  {
    pLabel: 'TBD Financier',
    pValue: 1,
  },
  {
    pLabel: 'TBD RH',
    pValue: 2,
  },
  {
    pLabel: 'TBD Conso',
    pValue: 3,
  },
]

export const getMockedReportUploadInfo = () => {
  return {
    reportId: 4,
    reportLabel: 'TBD Financier',
    reportTypeId: 5,
    accountId: 602,
    accountLabel: 'Boulangerie Bel Epi',
  }
}

export const getMockedPowerBIReport = () => {
  return new File(['Test Report'], 'my-report.pbx')
}

export const getMockedBIReportTypes = (): ReportType[] => [
  {
    reportTypeId: 1,
    name: 'loop',
    collaboratorLabel: 'Rapport Loop',
    customerLabel: 'TBD Financier',
  },
  {
    reportTypeId: 2,
    name: 'silae',
    collaboratorLabel: 'Rapport Silae',
    customerLabel: 'TBD RH',
  },
  {
    reportTypeId: 3,
    name: 'forms',
    collaboratorLabel: 'Rapport Forms',
    customerLabel: 'TBD Conso',
  },
  {
    reportTypeId: 4,
    name: 'payfit',
    collaboratorLabel: 'Rapport Payfit',
    customerLabel: 'TBD RH',
  },
]
