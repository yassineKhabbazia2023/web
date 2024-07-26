import type { WalletData, SearchCriteria, DeploymentStatus } from '../../types'
import type { AccountRow } from '@/services/account'
import { fetchAccounts } from '@/services/account'
import { COLORS } from './DeployConst'
import { getInitials, removeFalsyValues } from '@/helper'
import type { QueryResult } from '@/types/commonTypes'

export function getQueryParams(searchCriteria: SearchCriteria) {
  return {
    pageNumber: searchCriteria.currentPage,
    pageSize: searchCriteria.limit,
    search: searchCriteria.search,
    accountNumber: searchCriteria.accountNumber,
    deploymentStatus: searchCriteria.filterByDeploymentStatus,
  }
}

export function getSearchParams(searchCriteria: SearchCriteria, allAccounts: boolean = false) {
  const queryParams = getQueryParams(searchCriteria)
  const queryParamsWithoutUndefined = removeFalsyValues(queryParams)
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  return `${allAccounts ? 'all' : 'currentuser'}?${searchParams}`
}

export async function fetchWalletData(
  deploymentStatuses: DeploymentStatus[],
  searchCriteria: SearchCriteria,
  allAccounts: boolean = false,
) {
  const searchParams = getSearchParams(searchCriteria, allAccounts)
  const queryResult = await fetchAccounts(searchParams)
  const items = queryResult.items
    .map((account, index) => getMappedAccount(deploymentStatuses, account, index))

  const walletResult: QueryResult<WalletData> = {
    items,
    currentPage: queryResult.currentPage,
    totalItems: queryResult.totalItems,
    totalPage: queryResult.totalPage,
  }

  return walletResult
}

export function getMappedAccount(
  deploymentStatuses: DeploymentStatus[],
  account: AccountRow,
  index: number,
): WalletData {
  const {
    accountGlobalUniqueId: id,
    accountId,
    legalName: name,
    accountNumber,
    signatory,
    address,
    hub,
    deployment,
    isFavorite,
  } = account

  const { contactId, firstName, lastName, email } = signatory ?? {}
  const { city } = address
  const { status } = deployment

  const initials = getInitials(firstName, lastName)
  const colorIndex = index % COLORS.length
  const avatarColor = COLORS[colorIndex]

  const mappedAccount: WalletData = {
    owner: {
      contactId,
      firstName,
      lastName,
      email,
      initials,
      avatarColor,
    },
    city: city ?? '',
    hub: hub?.hubName ?? '',
    deploymentStatus: deploymentStatuses[status - 1],
    id,
    accountId,
    accountNumber: `${accountNumber}`,
    name,
    isFavorite,
  }

  return mappedAccount
}
