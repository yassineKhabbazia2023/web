export interface Report {
  accountId: number
  reportId: number
  reportLabel: string
  documentName: string
  embededReportUrl: string
  name: string
  createdBy: string
  creationDate: string
  type: {
    reportTypeId: number
    name: string
    collaboratorLabel: string
    customerLabel: string
  }
  updateDate: string
}
