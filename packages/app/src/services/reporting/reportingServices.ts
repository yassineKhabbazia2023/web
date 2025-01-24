import { API_PREFIXES } from '../config'
import { commonApi } from '@pulse/common'
import type { GetReportsRequest } from './reportingTypes'

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
