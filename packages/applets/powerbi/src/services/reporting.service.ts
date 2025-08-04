import { commonApi } from '@pulse/common'

const apiPrefix = 'reporting/api'

export const fetchBIReports = async (accountId: number, reportTypeId?: number) => {
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
