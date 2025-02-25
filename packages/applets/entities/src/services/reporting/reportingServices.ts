import { API_PREFIXES } from '@entities/common/config/services'
import { commonApi } from '@pulse/common'
import type {
  GetReportsRequest,
  GetReportAccountsRequest,
} from './reportingTypes'
import type { ReportType } from '@entities/common/types/BIReportsTypes'

export const fetchBIReports = async (
  accountId: number,
  reportTypeId?: number,
): Promise<GetReportsRequest> => {
  const basePath = `${API_PREFIXES.REPORTING}/reports`
  const path = reportTypeId ? basePath : `${basePath}/currentuser`
  const { data } = await commonApi().gateway.get(
    path,
    {
      params: {
        accountId,
        reportTypeId,
      },
    },
  )

  return data
}

export const fetchReportAccounts = async (
  searchParams: string,
): Promise<GetReportAccountsRequest> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.REPORTING}/account/${searchParams}`,
  )

  return data
}

export const fetchBIReportTypes = async (): Promise<ReportType[]> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.REPORTING}/reportType`,
  )

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
  await commonApi().gateway.post(
    `${API_PREFIXES.REPORTING}/reports/currentuser`,
    formData,
    {
      params: {
        accountId,
        reportTypeId,
        reportName,
        reportId,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
