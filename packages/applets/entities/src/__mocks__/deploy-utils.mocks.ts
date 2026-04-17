import type { DeploymentStatus, State, RegularWalletData, SearchCriteria } from '@entities/modules/wallet/types'
import type { QueryResult, SortingCriteria } from '@pulse/common/types'
import { MockEntityData, getMockSignatory, getMockAddress, getMockHub } from '@pulse/common/mocks'
import { getAvatarColorFromKey } from '@pulse/styleguide'

const basicSignatory = getMockSignatory('BASIC')
const basicAddress = getMockAddress('BASIC')
const basicHub = getMockHub('BASIC')

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

const sortingCriteria: SortingCriteria = {
  descending: false,
  field: '',
}

export function getMockedSearchCriteria(override: Partial<SearchCriteria> = {}): SearchCriteria {
  const defaultSearchCriteria: SearchCriteria = {
    currentPage: 1,
    limit: 15,
    search: undefined,
    filterByDeploymentStatus: undefined,
    sorting: sortingCriteria,
  }

  return {
    ...defaultSearchCriteria,
    ...override,
  }
}

export function getMockedDeploymentStatus(override: Partial<DeploymentStatus> = {}): DeploymentStatus {
  const defaultMappedAccount: DeploymentStatus = {
    text: 'To Deploy',
    color: 'warning',
    iconName: 'arrowUpCircle',
  }

  return {
    ...defaultMappedAccount,
    ...override,
  }
}

export function getMockedMappedAccount(
  override: Partial<RegularWalletData> = {},
): RegularWalletData {
  const accountNumber = override.accountNumber ?? MockEntityData.BASIC.accountNumber
  const avatarColor = getAvatarColorFromKey(accountNumber) as string

  const defaultMappedAccount: RegularWalletData = {
    accountId: MockEntityData.BASIC.accountId,
    accountNumber: MockEntityData.BASIC.accountNumber,
    city: basicAddress.city ?? '',
    deploymentStatus: getMockedDeploymentStatus(),
    hub: basicHub.hubName ?? '',
    id: MockEntityData.BASIC.accountGlobalUniqueId,
    isFavorite: false,
    isCustomerRelation: false,
    name: MockEntityData.BASIC.legalName,
    owner: {
      contactId: basicSignatory.contactId,
      avatarColor,
      email: basicSignatory.email,
      firstName: basicSignatory.firstName,
      initials: `${basicSignatory.firstName[0]}${basicSignatory.lastName[0]}`.toUpperCase(),
      lastName: basicSignatory.lastName,
    },
  }

  return {
    ...defaultMappedAccount,
    ...override,
  }
}

export function getMockedWalletQueryResult(
  override: Partial<QueryResult<RegularWalletData>> = {},
): QueryResult<RegularWalletData> {
  const legacyData = MockEntityData.LEGACY_GED
  const defaultWalletQueryResult: QueryResult<RegularWalletData> = {
    currentPage: 0,
    items: [
      getMockedMappedAccount(),
      getMockedMappedAccount({
        id: legacyData.accountGlobalUniqueId,
        accountId: legacyData.accountId,
        accountNumber: legacyData.accountNumber,
      }),
    ],
    totalItems: 2,
    totalPage: 1,
  }

  return {
    ...defaultWalletQueryResult,
    ...override,
  }
}
