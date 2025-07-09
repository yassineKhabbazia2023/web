import { ReportStatus, ReportTypeEnum } from '@entities/common/types/BIReports.enums.ts'
import type {
  ReportType,
  Report,
  ReportTableRow,
  MappedReportRow,
  ReportError,
  ReportStatistics,
} from '@entities/common/types/BIReportsTypes'
import type { PDropdownOption } from '@pulse/styleguide/types'

export const getMockedBIReports = (): Report[] => {
  return [
    {
      reportId: 4,
      reportLabel: 'Test report 2',
      accountId: 602,
      embededReportId: 'f7246623-bded-418e-9236-fe1fa1432c3a4',
      embededReportUrl: 'https://playground.powerbi.com/sampleReportEmbed',
      name: 'Test report 2',
      type: {
        reportTypeId: 2,
        name: 'silae',
        collaboratorLabel: 'Rapport Silae',
        customerLabel: 'TBD RH',
      },
      creationDate: '2024-05-30T09:53:43.68',
      updateDate: '2024-05-30T09:53:43.68',
      createdBy: 'Soufiane Y',
      documentName: 'test_report_2',
    },
    {
      reportId: 7,
      reportLabel: 'Test report 7',
      accountId: 602,
      embededReportId: 'h7246353-aced-432e-9236-df1fa1432s3a4',
      embededReportUrl: 'https://playground.powerbi.com/sampleReportEmbed',
      name: 'Test report 7',
      type: {
        reportTypeId: 7,
        name: 'personalisedRH',
        collaboratorLabel: 'Rapport personnalisé RH',
        customerLabel: 'TBD Personalisé',
      },
      creationDate: '2024-05-30T13:14:46.74',
      updateDate: '2024-05-30T13:14:46.74',
      createdBy: 'Soufiane Y',
      documentName: 'test_report_7',
    },
  ]
}

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

export const getMockReportTable = (): ReportTableRow[] => {
  return [
    {
      reportId: 1,
      accountId: 602,
      embedReportId: 'e16d35a4-5772-4932-85b0-3682c613a194',
      embedReportUrl: 'https://playground.powerbi.com/sampleReportEmbed',
      name: 'EC23696400_SLS 4_loop',
      type: {
        reportTypeId: 1,
        name: 'loop',
        collaboratorLabel: 'Rapport Loop',
        customerLabel: 'TBD Financier',
      },
      typeLabel: 'Loop Financier',
      accountNumber: 'EC23696400',
      legalName: 'Test Report',
      reportLabel: 'Test report 1',
      creationDate: '2024-05-30T09:53:28.770Z',
      updateDate: '2025-02-20T09:57:24.520Z',
      createdBy: 'User 1',
      status: ReportStatus.ONLINE,
      dataUpdateDate: '2025-04-16T15:21:03.410Z',
    },
    {
      reportId: 2,
      accountId: 602,
      embedReportId: 'b72c9e15-a07b-4e67-9e32-d67843f29dd1',
      embedReportUrl: 'https://playground.powerbi.com/sampleHRReport',
      name: 'HR2025_Survey_Results',
      type: {
        reportTypeId: 2,
        name: 'survey',
        collaboratorLabel: 'Rapport RH',
        customerLabel: 'Satisfaction Employé',
      },
      typeLabel: 'Enquête RH',
      accountNumber: 'HR202501',
      legalName: 'Human Resources Inc.',
      reportLabel: 'HR Report 2025',
      creationDate: '2025-01-12T10:22:00.000Z',
      updateDate: '2025-04-01T14:30:00.000Z',
      createdBy: 'Sophie Leclair',
      status: ReportStatus.OFFLINE,
      dataUpdateDate: '2025-03-30T16:00:00.000Z',
    },
  ]
}

export const getFormattedMockReports = (): MappedReportRow[] => {
  return [
    {
      reportId: 1,
      accountId: 602,
      embedReportId: 'e16d35a4-5772-4932-85b0-3682c613a194',
      embedReportUrl: 'https://playground.powerbi.com/sampleReportEmbed',
      name: 'EC23696400_SLS 4_loop',
      type: {
        reportTypeId: 1,
        name: 'loop',
        collaboratorLabel: 'Rapport Loop',
        customerLabel: 'TBD Financier',
      },
      typeLabel: 'Loop Financier',
      accountNumber: 'EC23696400',
      legalName: 'Test Report',
      reportLabel: 'Test report 1',
      creationDate: '2024-05-30T09:53:28.770Z',
      updateDate: '2025-02-20T09:57:24.520Z',
      createdBy: 'User 1',
      status: { type: ReportStatus.ONLINE, text: 'Online', color: 'success', iconName: 'checkCircle' },
      avatarColor: 'color-success',
      dataUpdateDate: '2025-04-16T15:21:03.410Z',
    },
    {
      reportId: 2,
      accountId: 602,
      embedReportId: 'b72c9e15-a07b-4e67-9e32-d67843f29dd1',
      embedReportUrl: 'https://playground.powerbi.com/sampleHRReport',
      name: 'HR2025_Survey_Results',
      type: {
        reportTypeId: 2,
        name: 'survey',
        collaboratorLabel: 'Rapport RH',
        customerLabel: 'Satisfaction Employé',
      },
      typeLabel: 'Enquête RH',
      accountNumber: 'HR202501',
      legalName: 'Human Resources Inc.',
      reportLabel: 'HR Report 2025',
      creationDate: '2025-01-12T10:22:00.000Z',
      updateDate: '2025-04-01T14:30:00.000Z',
      createdBy: 'Sophie Leclair',
      status: { type: ReportStatus.OFFLINE, text: 'Offline', color: 'gray-900', iconName: 'eyeSlash' },
      avatarColor: 'color-gray-900',
      dataUpdateDate: '2025-03-30T16:00:00.000Z',
    },
  ]
}

export const getMockReportErrors = (): ReportError[] => {
  return [
    {
      embedReportId: '123123',
      reportName: 'Error Report 1',
      reportType: ReportTypeEnum.LOOP,
      messages: ['System resource overload detected.', 'Loop detected in processing sequence.'],
      detectionDate: '2025-01-01T15:23:00Z',
    },
    {
      embedReportId: '456456',
      reportName: 'Error Report 2',
      reportType: ReportTypeEnum.FORMS,
      messages: ['Network timeout occurred while accessing external API.'],
      detectionDate: '2025-02-15T08:45:00Z',
    },
  ]
}

export const getMockReportStatistics = (): ReportStatistics => {
  return {
    failed: 10,
    offline: 2,
    online: 20,
  }
}
