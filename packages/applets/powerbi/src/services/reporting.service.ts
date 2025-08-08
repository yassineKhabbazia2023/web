import { commonApi } from '@pulse/common'
import type { ReportType, GetReportAccountsRequest, GetReportsRequest } from '@powerbi/types/bi-reports.types'

const apiPrefix = 'reporting/api'

export const fetchBIReports = async (accountId: number, reportTypeId?: number): Promise<GetReportsRequest> => {
  const basePath = `${apiPrefix}/reports`
  const path = reportTypeId ? basePath : `${basePath}/currentuser`
  const { data } = await commonApi().gateway.get(path, {
    params: {
      accountId,
      reportTypeId,
    },
  })

  return data
}

export const fetchBIToken = async (reportId: string, accountId: number): Promise<string> => {
  const { data } = await commonApi().gateway.get(`${apiPrefix}/reports/${reportId}/embedToken?accountId=${accountId}`)

  return data
}

export const fetchBIReportTypes = async (): Promise<ReportType[]> => {
  const { data } = await commonApi().gateway.get(`${apiPrefix}/reportType`)

  return data
}

export const fetchReportAccounts = async (searchParams: string): Promise<GetReportAccountsRequest> => {
  const pathSuffix = searchParams ? `/${searchParams}` : ''
  const { data } = await commonApi().gateway.get(`${apiPrefix}/account${pathSuffix}`)

  return data
}

export const uploadBIreport = async (
  accountId: number,
  reportTypeId: number,
  reportFile: File,
  reportName?: string,
  reportId?: number,
) => {
  const formData = new FormData()
  formData.append('report', reportFile)
  await commonApi().gateway.post(`${apiPrefix}/reports/currentuser`, formData, {
    params: {
      accountId,
      reportTypeId,
      reportName,
      reportId,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
