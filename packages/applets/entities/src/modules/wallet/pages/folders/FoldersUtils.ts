import type { RegularWalletData, SearchCriteria, DeploymentStatus } from '@entities/modules/wallet/types'
import type { AccountRow } from '@entities/services/account'
import { fetchAccounts } from '@entities/services/account'
import { fetchWalletAccounts } from '@entities/services/wallet'
import { getInitials } from '@entities/helpers'
import type { QueryResult } from '@pulse/common/types'
import { getAvatarColorFromKey } from '@pulse/styleguide'
import { getSearchParams } from '@pulse/common/utils'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { useUserStore } from '@pulse/common/stores'

export async function fetchWalletData(
  deploymentStatuses: DeploymentStatus[],
  searchCriteria: SearchCriteria,
  allAccounts: boolean = false,
) {
  const queryResult = allAccounts === true
    ? await fetchAccounts(getSearchParams(searchCriteria, true))
    : await fetchWalletAccounts(searchCriteria)
  const items = queryResult.items
    .map((account, index) => getMappedAccount(deploymentStatuses, account, index))

  const walletResult: QueryResult<RegularWalletData> = {
    items,
    currentPage: queryResult.currentPage,
    totalItems: queryResult.totalItems,
    totalPage: queryResult.totalPage,
  }

  const newCount = await CurrentUserService.getUserWalletInformation()
  useUserStore().setWalletInformation(newCount)

  return walletResult
}

export function getMappedAccount(
  deploymentStatuses: DeploymentStatus[],
  account: AccountRow,
  _index: number,
): RegularWalletData {
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
    lastActivityDate,
  } = account

  const { contactId, firstName, lastName, email } = signatory ?? {}
  const { city } = address
  const { status } = deployment

  const initials = getInitials(firstName, lastName)
  const avatarColor = getAvatarColorFromKey(accountNumber) as string

  const mappedAccount: RegularWalletData = {
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
    lastActivityDate: lastActivityDate ?? null,
  }

  return mappedAccount
}
