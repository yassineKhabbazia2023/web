import { API_PREFIXES } from '../config'
import { commonApi } from '@pulse/common'
import type { GetReportsRequest } from './reportingTypes'

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
