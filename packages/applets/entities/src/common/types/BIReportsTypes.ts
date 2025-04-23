export interface ReportType {
  reportTypeId: number
  name: string
  collaboratorLabel: string
  customerLabel: string
}

export interface Report {
  accountId: number
  reportId: number
  reportLabel: string
  documentName: string
  embededReportUrl: string
  embededReportId: string
  name: string
  createdBy: string
  creationDate: string
  type: ReportType
  updateDate?: string
  dataUpdateDate?: string
}
