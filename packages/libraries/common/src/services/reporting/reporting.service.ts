import { api } from '@pulse/common/api'
import { API_PREFIXES } from '../../constants/api-prefixes'

export class ReportingService {
  static async getTotalBIReports(accountId: number): Promise<number> {
    const { data } = await api.gateway.get(`${API_PREFIXES.REPORTING}/reports/currentuser`, {
      params: { accountId },
    })

    return data?.totalItems ?? 0
  }
}
