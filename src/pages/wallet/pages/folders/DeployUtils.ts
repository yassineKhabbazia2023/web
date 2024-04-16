import type { IWalletData, SearchCriteria, DeploymentStatus } from '../../types'
import type { AccountRow } from '@/services/account'
import { fetchAccounts } from '@/services/account'
import { COLORS, DEFAULT_HUB } from './DeployConst'
import { getInitials, removeFalsyValues } from '@/helper'
import type { QueryResult } from '@/types/commonTypes'

export function getQueryParams(searchCriteria: SearchCriteria) {
  return {
    pageNumber: searchCriteria.currentPage,
    pageSize: searchCriteria.limit,
    search: searchCriteria.search,
    deploymentStatus: searchCriteria.filterByDeploymentStatus,
  }
}

export function getSearchParams(searchCriteria: SearchCriteria) {
  const queryParams = getQueryParams(searchCriteria)
  const queryParamsWithoutUndefined = removeFalsyValues(queryParams)
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  return `currentuser?${searchParams}`
}

export async function fetchWalletData(
  deploymentStatuses: DeploymentStatus[],
  searchCriteria: SearchCriteria,
) {
  const searchParams = getSearchParams(searchCriteria)
  const queryResult = await fetchAccounts(searchParams)
  const items = queryResult.items
    .map((account, index) => getMappedAccount(deploymentStatuses, account, index))

  const walletResult: QueryResult<IWalletData> = {
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
): IWalletData {
  const {
    accountGlobalUniqueId: id,
    accountId,
    legalName: name,
    accountNumber,
    signatory,
    address,
    deployment,
    isFavorite,
  } = account

  const { firstName, lastName, email } = signatory
  const { city } = address
  const { status } = deployment

  const initials = getInitials(firstName, lastName)
  const colorIndex = index % COLORS.length
  const avatarColor = COLORS[colorIndex]
  const hub = DEFAULT_HUB

  const mappedAccount: IWalletData = {
    owner: {
      firstName,
      lastName,
      email,
      initials,
      avatarColor,
    },
    city: city ?? '',
    hub,
    deploymentStatus: deploymentStatuses[status - 1],
    id,
    accountId,
    accountNumber: `${accountNumber}`,
    name,
    isFavorite,
  }

  return mappedAccount
}
