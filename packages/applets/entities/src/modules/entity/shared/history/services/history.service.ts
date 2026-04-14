import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import type { ActivitiesResponse, ActivitySearchCriteria, FetchActivitiesParams } from '../types/history.types'

export class HistoryService {
  static async fetchActivities(criteria: ActivitySearchCriteria): Promise<ActivitiesResponse> {
    const url = `${API_PREFIXES.HISTORY}/activities/currentuser`

    const params: FetchActivitiesParams = {
      accountId: criteria.accountId,
      pageNumber: criteria.page,
      pageSize: criteria.pageSize,
      'Sorting.Field': 'createDate',
      'Sorting.Descending': true,
    }

    if (isNotNullNorEmpty(criteria.search)) {
      params.search = criteria.search
    }

    const { data } = await api.gateway.get<ActivitiesResponse>(url, { params })

    return data
  }
}
