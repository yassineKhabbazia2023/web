import { API_PREFIXES } from '@entities/common/config/services'
import { commonApi } from '@pulse/common'
import type {
  GetReportsRequest,
  GetReportAccountsRequest,
} from './reportingTypes'
import type { ReportError, ReportTableRow, ReportType } from '@entities/common/types/BIReportsTypes'
import type { FilterQueryParams } from '@entities/pages/wallet/types'
import type { QueryResult } from '@pulse/common/types'

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

export const fetchReportAccounts = async (searchParams: string): Promise<GetReportAccountsRequest> => {
  const pathSuffix = searchParams ? `/${searchParams}` : ''
  const { data } = await commonApi().gateway.get(`${API_PREFIXES.REPORTING}/account${pathSuffix}`)

  return data
}

export const fetchReportErrors = async (): Promise<QueryResult<ReportError>> => {
  const { data } = await commonApi().gateway.get(`${API_PREFIXES.REPORTING}/report-errors`)

  return data
}

export const fetchBIReportTypes = async (): Promise<ReportType[]> => {
  const { data } = await commonApi().gateway.get(`${API_PREFIXES.REPORTING}/reportType`)

  return data
}

export const fetchBIToken = async (reportId: string, accountId: number): Promise<string> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.REPORTING}/reports/${reportId}/embedToken?accountId=${accountId}`,
  )

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

export const fetchAvailableReports = async (queryParams: FilterQueryParams): Promise<QueryResult<ReportTableRow>> => {
  const { data } = await commonApi().gateway.get(`${API_PREFIXES.REPORTING}/reports/available`, {
    params: queryParams,
  })

  return data
}

export const updateReportStatus = async (accountId: number, reportId: number, status: string): Promise<void> => {
  return await commonApi().gateway.patch(
    `${API_PREFIXES.REPORTING}/reports`,
    [
      {
        path: '/status',
        op: 'replace',
        value: status,
      },
    ],
    {
      params: {
        accountId,
        reportId,
      },
    },
  )
}
