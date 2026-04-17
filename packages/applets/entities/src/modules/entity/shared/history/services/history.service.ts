import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { appendArrayParams } from '@pulse/toolbox/utils/http'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import type {
  ActivitiesResponse,
  ActivitySearchCriteria,
  ThemeWithCategories,
} from '../types/history.types'

export class HistoryService {
  static async fetchThemes(): Promise<ThemeWithCategories[]> {
    const url = `${API_PREFIXES.HISTORY}/themes`
    const { data } = await api.gateway.get<ThemeWithCategories[]>(url)
    return data
  }

  static async fetchActivities(criteria: ActivitySearchCriteria): Promise<ActivitiesResponse> {
    const url = `${API_PREFIXES.HISTORY}/activities/currentuser`
    const searchParams = new URLSearchParams()

    searchParams.append('accountId', criteria.accountId.toString())
    searchParams.append('pageNumber', criteria.page.toString())
    searchParams.append('pageSize', criteria.pageSize.toString())
    searchParams.append('Sorting.Field', 'createDate')
    searchParams.append('Sorting.Descending', 'true')

    if (isNotNullNorEmpty(criteria.search)) {
      searchParams.append('search', criteria.search)
    }

    appendArrayParams(searchParams, 'ThemeIds', criteria.themeIds)
    appendArrayParams(searchParams, 'CategoryIds', criteria.categoryIds)

    if (isNotNullNorEmpty(criteria.fromDate)) {
      searchParams.append('FromDate', criteria.fromDate)
    }

    if (isNotNullNorEmpty(criteria.toDate)) {
      searchParams.append('ToDate', criteria.toDate)
    }

    const { data } = await api.gateway.get<ActivitiesResponse>(url, { params: searchParams })

    return data
  }
}
