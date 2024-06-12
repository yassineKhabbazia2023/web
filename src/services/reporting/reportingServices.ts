import { API_PREFIXES } from '@/common/config/services'
import { commonApi } from '@kpmg/common'
import type {
  GetReportsRequest,
  GetReportAccountsRequest,
} from './reportingTypes'
import type { ReportType } from '@/pages/power-bi/pages/bi-reports/BIReportsTypes'

export const fetchBIReports = async (
  accountId: number,
  reportTypeId?: number,
): Promise<GetReportsRequest> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.REPORTING}/reports`,
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

export const fetchBIToken = async (): Promise<string> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.REPORTING}/reports/token`,
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
