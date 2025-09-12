import { commonApi } from '@pulse/common'
import type { ReportType, GetReportAccountsRequest, GetReportsRequest } from '@powerbi/types/bi-reports.types'
import { API_PREFIXES } from '@pulse/common/constants'

export const fetchBIReports = async (accountId: number, reportTypeId?: number): Promise<GetReportsRequest> => {
  const basePath = `${API_PREFIXES.REPORTING}/reports`
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
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.REPORTING}/reports/${reportId}/embedToken?accountId=${accountId}`,
  )

  return data
}

export const fetchBIReportTypes = async (): Promise<ReportType[]> => {
  const { data } = await commonApi().gateway.get(`${API_PREFIXES.REPORTING}/reportType`)

  return data
}

export const fetchReportAccounts = async (searchParams: string): Promise<GetReportAccountsRequest> => {
  const pathSuffix = searchParams ? `/${searchParams}` : ''
  const { data } = await commonApi().gateway.get(`${API_PREFIXES.REPORTING}/account${pathSuffix}`)

  return data
}

export const activateSmartOfferTrial = (accountId: number): Promise<GetReportAccountsRequest> => {
  return commonApi().gateway.patch(`${API_PREFIXES.ACCOUNT}/activate-offer/currentuser`, {}, { params: { accountId } })
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
  await commonApi().gateway.post(`${API_PREFIXES.REPORTING}/reports/currentuser`, formData, {
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
