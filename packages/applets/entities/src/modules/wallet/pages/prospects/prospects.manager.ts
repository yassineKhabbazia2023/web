import type { ProspectWalletData, ProspectAccountRow, SearchCriteria, SearchResult } from '@entities/modules/wallet/types'
import { getInitials } from '@entities/helpers'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'

export class ProspectsManager {
  static getMappedProspectAccount(prospect: ProspectAccountRow): ProspectWalletData {
    const {
      prospectId,
      accountId,
      accountNumber,
      legalName: name,
      signatory,
      stepCode,
      dossierCAC,
    } = prospect

    const { contactId, firstName, lastName, email } = signatory ?? {}

    const initials = getInitials(firstName, lastName)

    return {
      owner: {
        contactId,
        firstName,
        lastName,
        email,
        initials,
      },
      prospectId,
      accountId,
      accountNumber,
      name,
      isFavorite: false,
      onboardingStep: stepCode,
      cacFolder: dossierCAC,
    }
  }

  private static buildProspectsSearchParams(searchCriteria: SearchCriteria): URLSearchParams {
    const params = new URLSearchParams()
    params.set('pageNumber', String(searchCriteria.currentPage))
    params.set('pageSize', String(searchCriteria.limit))

    if (isNotNullNorEmpty(searchCriteria.search)) {
      params.set('search', searchCriteria.search)
    }

    if (isNotNullNorEmpty(searchCriteria.sorting?.field)) {
      params.set('sorting.field', searchCriteria.sorting.field)
      params.set('sorting.descending', String(searchCriteria.sorting.descending))
    }

    return params
  }

  static async fetchProspectsData(searchCriteria: SearchCriteria): Promise<SearchResult<ProspectWalletData>> {
    try {
      const searchParams = ProspectsManager.buildProspectsSearchParams(searchCriteria)
      const response = await ProspectsService.fetchProspectsAccounts(searchParams)
      const items = response.items.map(ProspectsManager.getMappedProspectAccount)

      return {
        items,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
        totalPage: response.totalPages,
      }
    } catch (error) {
      logger.error('Error while fetching prospects data', error)
      return { items: [], currentPage: 0, totalItems: 0, totalPage: 0 }
    }
  }
}
