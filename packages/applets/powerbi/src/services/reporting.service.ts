import { api } from '@pulse/common/api'
import type { ReportType, GetReportAccountsRequest, GetReportsRequest, ReportQueryParams, ReportTableRow, ReportStatistics, ReportError } from '@powerbi/types/bi-reports.types'
import { API_PREFIXES } from '@pulse/common/constants'
import { QueryResult } from '@pulse/common/types'
import { serializeParams } from '@pulse/toolbox/utils/http'
import { ReportDeleteOption } from '@powerbi/enums/bi-reports.enum'

export const fetchBIReports = async (accountId: number, reportTypeId?: number): Promise<GetReportsRequest> => {
  const basePath = `${API_PREFIXES.REPORTING}/reports`
  const path = reportTypeId ? basePath : `${basePath}/currentuser`
  const { data } = await api.gateway.get(path, {
    params: {
      accountId,
      reportTypeId,
    },
  })

  return data
}

export const fetchReportAccounts = async (searchParams: string): Promise<GetReportAccountsRequest> => {
  const pathSuffix = searchParams ? `/${searchParams}` : ''
  const { data } = await api.gateway.get(`${API_PREFIXES.REPORTING}/account${pathSuffix}`)

  return data
}

export const fetchReportErrors = async (): Promise<QueryResult<ReportError>> => {
  const { data } = await api.gateway.get(`${API_PREFIXES.REPORTING}/report-errors`)

  return data
}

export const fetchBIReportTypes = async (): Promise<ReportType[]> => {
  const { data } = await api.gateway.get(`${API_PREFIXES.REPORTING}/reportType`)

  return data
}

export const fetchReportStatistics = async (): Promise<ReportStatistics> => {
  const { data } = await api.gateway.get(`${API_PREFIXES.REPORTING}/reports/statistics`)

  return data
}

export const fetchBIToken = async (reportId: string, accountId: number): Promise<string> => {
  const { data } = await api.gateway.get(
    `${API_PREFIXES.REPORTING}/reports/${reportId}/embedToken?accountId=${accountId}`,
  )

  return data
}

export const deleteBIReport = async (
  embedReportId: string,
  reportDeleteOption: ReportDeleteOption,
): Promise<void> => {
  await api.gateway.delete(`${API_PREFIXES.REPORTING}/reports`, {
    params: { embedReportId, option: reportDeleteOption },
  })
}

export const activateSmartOfferTrial = (accountId: number): Promise<GetReportAccountsRequest> => {
  return api.gateway.patch(`${API_PREFIXES.ACCOUNT}/activate-offer/currentuser`, {}, { params: { accountId } })
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
  await api.gateway.post(`${API_PREFIXES.REPORTING}/reports/currentuser`, formData, {
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

export const fetchAvailableReports = async (
  queryParams: ReportQueryParams,
): Promise<QueryResult<ReportTableRow>> => {
  const { data } = await api.gateway.get(`${API_PREFIXES.REPORTING}/reports/available`, {
    params: queryParams,
    paramsSerializer: serializeParams,
  })

  return data
}

export const updateReportStatus = async (accountId: number, reportId: number, status: string): Promise<void> => {
  return await api.gateway.patch(
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
