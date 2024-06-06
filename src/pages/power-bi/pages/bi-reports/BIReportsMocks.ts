import type { Report } from './BIReportsTypes'

export const getMockedBIReports = (): Report[] => {
  return [
    {
      reportId: 4,
      reportLabel: 'Test report 2',
      accountId: 602,
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
