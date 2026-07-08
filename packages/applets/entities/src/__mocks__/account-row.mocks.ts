import type { PatchOperation } from '@entities/services/patch-record'
import type {
  Account,
  AccountRow,
  Signatory,
  Deployment,
  ReferentialStructure,
  Hub,
  AccountsDelegationDetails,
  AccountsDelegation,
  SearchAccountItem,
} from '@entities/services/account/account.type'
import { AddressType } from '@entities/enums'
import type { Address, Office, QueryResult, MockEntityKey } from '@pulse/common/types'
import {
  getMockAddress as getCommonMockAddress,
  getMockSignatory as getCommonMockSignatory,
  getMockDeployment as getCommonMockDeployment,
  getMockAccountRow as getCommonMockAccountRow,
  MockEntityData,
  MockEntityId,
} from '@pulse/common/mocks'
import accountReferentialInformation from '@entities/__mocks__/json/accountReferentialInformation.json'
import referentialHubs from '@entities/__mocks__/json/referentialHubs.json'
import referentialOffices from '@entities/__mocks__/json/referentialOffices.json'

export function getMockedAddress(override: Partial<Address> = {}): Address {
  return {
    ...getCommonMockAddress('BASIC'),
    ...override,
  }
}

export function getMockedSignatory(override: Partial<Signatory> = {}): Signatory {
  return {
    ...getCommonMockSignatory('BASIC'),
    ...override,
  }
}

export function getMockedDeployment(override: Partial<Deployment> = {}): Deployment {
  return {
    ...getCommonMockDeployment('BASIC'),
    ...override,
  }
}

export function getMockedAccountQueryResult(
  override: Partial<QueryResult<AccountRow>> = {},
): QueryResult<AccountRow> {
  const accountRow1 = getMockedAccountRow()
  const accountRow2 = getMockedAccountRow({
    accountId: MockEntityId.LEGACY_GED,
    accountNumber: MockEntityData.LEGACY_GED.accountNumber,
  })
  const items = [accountRow1, accountRow2]

  const defaultQueryResult: QueryResult<AccountRow> = {
    currentPage: 1,
    items,
    totalItems: 2,
    totalPage: 1,
  }
  return {
    ...defaultQueryResult,
    ...override,
  }
}

export function getMockedAccountRow(override: Partial<AccountRow> = {}): AccountRow {
  const commonAccountRow = getCommonMockAccountRow('BASIC')
  const defaultAccountRow: AccountRow = {
    ...commonAccountRow,
    isCustomerRelation: false,
    lastActivityDate: null,
  }

  return {
    ...defaultAccountRow,
    ...override,
  }
}

export function getMockedAccountRowForEntity(entityKey: MockEntityKey, override: Partial<AccountRow> = {}): AccountRow {
  const commonAccountRow = getCommonMockAccountRow(entityKey)
  return {
    ...commonAccountRow,
    isCustomerRelation: false,
    lastActivityDate: null,
    ...override,
  }
}

export function getMockedAccount(): Account {
  const entity = MockEntityData.BASIC
  return {
    accountId: entity.accountId,
    accountNumber: entity.accountNumber,
    iconName: 'mon icone',
    isActive: true,
    accountNumberSource: entity.accountNumber,
    employeeCount: 8,
    commercialName: entity.legalName,
    accounting: {
      accountingType: 'Engagement',
      activityType: 'Prestation de services',
      fiscalExerciseStartDate: '2024-02-07T15:49:54',
      fiscalExerciseDuration: 12,
      fiscalSystem: 'BIC',
      taxationSystem: 'Impôt sur le revenu',
    },
    legal: {
      legalName: entity.legalName,
      siret: '443 061 841 00047',
      createdAt: '2022-01-22T12:00:00',
      legalFormCode: 'EURL',
      legalForm: 'Entreprise unipersonnelle à responsabilité limitée',
      staffSizeRange: 'De 4 à 15 salariés',
      naf: [
        {
          nafId: 1,
          nafCode: '96.0F4',
          nafLabel: '96.0F4',
        },
      ],
    },
    vat: {
      system: 'Réel normal - CA3 mensuelle',
      intra: 'FR 32 123456789',
      type: 'Encaissement',
    },
    address: [getMockedAddress()],
    phone: [
      {
        phoneId: 5,
        phoneNumber: '0622827143',
      },
    ],
    email: 'contact@acmecorp.com',
    hub: {
      hubId: entity.accountId,
      hubName: 'Hub Ile-de-France',
    },
    deploymentPlanning: [getMockedDeployment()],
  }
}

export function getMockedPatchOperations(): PatchOperation[] {
  return [{
    op: 'replace',
    path: '/a/b',
    value: 'c',
  }]
}

export function getMockedAccountReferential(): ReferentialStructure {
  return accountReferentialInformation
}

export function getMockedReferentialHubs(): Hub[] {
  return referentialHubs
}

function getValidAddressType(addressType: string): AddressType | undefined {
  if (addressType === AddressType.DELIVERY || addressType === AddressType.BILLING) {
    return addressType
  };
}

export function getMockedReferentialOffices(): Office[] {
  return referentialOffices.map(office => ({
    ...office,
    address: {
      ...office.address,
      addressType: getValidAddressType(office.address.addressType),
    },
  }))
}

export function getMockedAccountsDelegationDetails(override: Partial<AccountsDelegationDetails> = {}) {
  const delegationRequestDetails: AccountsDelegationDetails = {
    delegateeId: MockEntityId.BASIC,
    startDate: '2025-07-09T09:19:43.192Z',
    isAutomaticDelegation: true,
    ...override,
  }

  return delegationRequestDetails
}

export function getMockedAccountsDelegation(override: Partial<AccountsDelegation> = {}): AccountsDelegation {
  const delegationRequest: AccountsDelegation = {
    isFullDelegation: true,
    includePennylaneAccess: false,
    delegationDetails: [getMockedAccountsDelegationDetails()],
    accountIds: [MockEntityId.BASIC, MockEntityId.LEGACY_GED, MockEntityId.PENNYLANE],
    ...override,
  }

  return delegationRequest
}

export function getMockedSearchAccountItem(override: Partial<SearchAccountItem> = {}): SearchAccountItem {
  const entity = MockEntityData.BASIC
  const searchAccountItem: SearchAccountItem = {
    accountId: entity.accountId,
    legalName: entity.legalName,
    accountNumber: entity.accountNumber,
    siret: '12345678901234',
    directorEmail: 'director@example.com',
    ...override,
  }

  return searchAccountItem
}
