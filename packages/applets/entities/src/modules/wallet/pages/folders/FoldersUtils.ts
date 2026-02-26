import type { WalletData, SearchCriteria, DeploymentStatus } from '@entities/modules/wallet/types'
import type { AccountRow } from '@entities/services/account'
import { fetchAccounts } from '@entities/services/account'
import { getInitials } from '@entities/helpers'
import type { QueryResult } from '@pulse/common/types'
import { getAvatarColorFromKey } from '@pulse/styleguide'
import { getSearchParams } from '@pulse/common/utils'

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
  _index: number,
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
    isCustomerRelation,
  } = account

  const { contactId, firstName, lastName, email } = signatory ?? {}
  const { city } = address
  const { status } = deployment

  const initials = getInitials(firstName, lastName)
  const avatarColor = getAvatarColorFromKey(accountNumber) as string

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
    isCustomerRelation,
  }

  return mappedAccount
}
