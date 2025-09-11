import type { PatchOperation } from '@entities/services/PatchRecordService'
import type {
  Account,
  AccountRow,
  Signatory,
  Deployment,
  ReferentialStructure,
  Hub,
  AccountsDelegationDetails,
  AccountsDelegation,
} from '@entities/services/account/accountTypes'
import { AddressType } from '@entities/services/account/account.enums'
import type { Address, Office, QueryResult } from '@pulse/common/types'
import accountReferentialInformation from '@entities/__mocks__/json/accountReferentialInformation.json'
import referentialHubs from '@entities/__mocks__/json/referentialHubs.json'
import referentialOffices from '@entities/__mocks__/json/referentialOffices.json'

export function getMockedAddress(override: Partial<Address> = {}): Address {
  const defaultAddress: Address = {
    addressId: 2,
    addressLine1: 'Rue de liege',
    addressLine2: 'test 2',
    addressLine3: 'test 3',
    addressType: 'billing',
    country: 'France',
    city: 'Paris',
    zipCode: '25300',
  }

  return {
    ...defaultAddress,
    ...override,
  }
}

export function getMockedSignatory(override: Partial<Signatory> = {}): Signatory {
  const defaultSignatory = {
    contactId: 22,
    globalContactId: '231231-34234',
    firstName: 'Signa',
    lastName: 'Tory',
    email: 'sign@test.fr',
    status: 'status',
    personaName: 'person Name',
    creationDate: '2024-03-25',
  }

  return {
    ...defaultSignatory,
    ...override,
  }
}

export function getMockedDeployment(override: Partial<Deployment> = {}): Deployment {
  const defaultDeployment: Deployment = {
    deploymentId: 3242,
    deploymentDate: '2024-02-01',
    status: 1,
  }

  return {
    ...defaultDeployment,
    ...override,
  }
}

export function getMockedAccountQueryResult(
  override: Partial<QueryResult<AccountRow>> = {},
): QueryResult<AccountRow> {
  const accountRow1 = getMockedAccountRow()
  const accountRow2 = getMockedAccountRow({
    accountId: 2,
    accountNumber: '10102',
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
  const defaultAccountRow: AccountRow = {
    accountId: 1,
    accountGlobalUniqueId: 'account-global-unique-id',
    accountNumber: '10102',
    legalName: 'Legal Name',
    isFavorite: false,
    hub: {
      hubId: 1,
      hubName: 'Hub Aquitaine Nord',
    },
    address: getMockedAddress(),
    signatory: getMockedSignatory(),
    deployment: getMockedDeployment(),
    isCustomerRelation: false,
  }

  return {
    ...defaultAccountRow,
    ...override,
  }
}

export function getMockedAccount(): Account {
  return {
    accountId: 5,
    accountNumber: '1999162161',
    iconName: 'mon icone',
    isActive: true,
    accountNumberSource: '1999162161',
    employeeCount: 8,
    commercialName: 'SCI Licorn',
    accounting: {
      accountingType: 'Engagement',
      activityType: 'Prestation de services',
      fiscalExerciseStartDate: '2024-02-07T15:49:54',
      fiscalExerciseDuration: 12,
      fiscalSystem: 'BIC',
      taxationSystem: 'Impôt sur le revenu',
    },
    legal: {
      legalName: 'SCI Licorn',
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
    email: 'contact@johnnyspizza.com',
    hub: {
      hubId: 14,
      hubName: 'Hub Normandie Seine Baie de Somme',
    },
    deploymentPlanning: [
      {
        deploymentId: 1,
        deploymentDate: '2024-02-07T00:00:00',
        status: 1,
      },
    ],
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
    delegateeId: 1,
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
    accountIds: [1, 2, 3],
    ...override,
  }

  return delegationRequest
}
