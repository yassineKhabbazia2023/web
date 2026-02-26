import { commonApi as api } from '@pulse/common'
import { API_PREFIXES } from '@pulse/common/constants'
import type { ActivitiesResponse, ActivitySearchCriteria } from '../types/history.types'

export class HistoryService {
  static async fetchActivities(criteria: ActivitySearchCriteria): Promise<ActivitiesResponse> {
    const url = `${API_PREFIXES.HISTORY}/activities/currentuser`

    const { data } = await api().gateway.get<ActivitiesResponse>(url, {
      params: {
        accountId: criteria.accountId,
        pageNumber: criteria.page,
        pageSize: criteria.pageSize,
        'Sorting.Field': 'createDate',
        'Sorting.Descending': true,
      },
    })

    return data
  }
}
