import { PIArrowUpCircle } from '@kpmg/styleguide'
import type { DeploymentStatus, State, WalletData, SearchCriteria } from '../../types'
import type { QueryResult } from '@entities/common/types'

export function getMockedState(override: Partial<State> = {}): State {
  const defaultState = {
    data: [],
    currentPage: 0,
    limit: 10,
    totalPage: 10,
    totalItems: 100,
    search: '',
    isLoading: false,
    filterByDeploymentStatus: undefined,
  }

  return {
    ...defaultState,
    ...override,
  }
}

export function getMockedSearchCriteria(override: Partial<SearchCriteria> = {}): SearchCriteria {
  const defaultSearchCriteria: SearchCriteria = {
    currentPage: 1,
    limit: 15,
    search: undefined,
    filterByDeploymentStatus: undefined,
  }

  return {
    ...defaultSearchCriteria,
    ...override,
  }
}

export function getMockedDeploymentStatus(override: Partial<DeploymentStatus> = {}): DeploymentStatus {
  const defaultMappedAccount: DeploymentStatus = {
    text: 'To Deploy',
    icon: PIArrowUpCircle,
    color: 'warning',
  }

  return {
    ...defaultMappedAccount,
    ...override,
  }
}

export function getMockedMappedAccount(
  override: Partial<WalletData> = {},
  avatarColor = 'persian',
): WalletData {
  const defaultMappedAccount: WalletData = {
    accountId: 1,
    accountNumber: '10102',
    city: 'Paris',
    deploymentStatus: getMockedDeploymentStatus(),
    hub: 'Hub Aquitaine Nord',
    id: 'account-global-unique-id',
    isFavorite: false,
    name: 'Legal Name',
    owner: {
      contactId: 22,
      avatarColor,
      email: 'sign@kpmg.fr',
      firstName: 'Signa',
      initials: 'ST',
      lastName: 'Tory',
    },
  }

  return {
    ...defaultMappedAccount,
    ...override,
  }
}

export function getMockedWalletQueryResult(
  override: Partial<QueryResult<WalletData>> = {},
): QueryResult<WalletData> {
  const defaultWalletQueryResult: QueryResult<WalletData> = {
    currentPage: 0,
    items: [
      getMockedMappedAccount(),
      getMockedMappedAccount({ accountId: 2, accountNumber: '10102' }),
    ],
    totalItems: 2,
    totalPage: 1,
  }

  return {
    ...defaultWalletQueryResult,
    ...override,
  }
}
