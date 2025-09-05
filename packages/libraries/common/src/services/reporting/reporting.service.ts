import { commonApi } from '@pulse/common'
import { API_PREFIXES } from '../../constants/api-prefixes'

export class ReportingService {
  static async getTotalBIReports(accountId: number): Promise<number> {
    const { data } = await commonApi().gateway.get(`${API_PREFIXES.REPORTING}/reports/currentuser`, {
      params: { accountId },
    })

    return data?.totalItems ?? 0
  }
}
