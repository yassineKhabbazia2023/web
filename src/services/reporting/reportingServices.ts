import { API_PREFIXES } from '@/common/config/services'
import { commonApi } from '@kpmg/common'
import type { GetReportsRequest } from './reportingTypes'

export const fetchBIReports = async (
  accountId: number,
): Promise<GetReportsRequest> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.REPORTING}/reports/${accountId}`,
  )

  return data
}
