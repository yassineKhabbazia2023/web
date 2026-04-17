import type { RegularWalletData } from '@entities/modules/wallet/types'
import { MockEntityData, getMockSignatory } from '@pulse/common/mocks'

const basicSignatory = getMockSignatory('BASIC')
const legacySignatory = getMockSignatory('LEGACY_GED')

export const mockTableData: RegularWalletData[] = [
  {
    owner: {
      contactId: basicSignatory.contactId,
      firstName: basicSignatory.firstName,
      lastName: basicSignatory.lastName,
      email: basicSignatory.email,
      initials: `${basicSignatory.firstName[0]}${basicSignatory.lastName[0]}`.toUpperCase(),
      avatarColor: MockEntityData.BASIC.color,
    },
    city: 'Paris',
    hub: 'Hub Ile-de-France',
    deploymentStatus: {
      text: 'To Deploy',
      color: 'warning',
      iconName: 'arrowUpCircle',
    },
    id: MockEntityData.BASIC.accountGlobalUniqueId,
    accountId: MockEntityData.BASIC.accountId,
    accountNumber: MockEntityData.BASIC.accountNumber,
    name: MockEntityData.BASIC.legalName,
    isFavorite: false,
    isCustomerRelation: false,
  },
  {
    owner: {
      contactId: legacySignatory.contactId,
      firstName: legacySignatory.firstName,
      lastName: legacySignatory.lastName,
      email: legacySignatory.email,
      initials: `${legacySignatory.firstName[0]}${legacySignatory.lastName[0]}`.toUpperCase(),
      avatarColor: MockEntityData.LEGACY_GED.color,
    },
    city: 'Lyon',
    hub: 'Hub Rhone-Alpes',
    deploymentStatus: {
      text: 'In progress',
      color: 'warning',
      iconName: 'arrowRepeat',
    },
    id: MockEntityData.LEGACY_GED.accountGlobalUniqueId,
    accountNumber: MockEntityData.LEGACY_GED.accountNumber,
    accountId: MockEntityData.LEGACY_GED.accountId,
    name: MockEntityData.LEGACY_GED.legalName,
    isFavorite: true,
    isCustomerRelation: false,
  },
]
