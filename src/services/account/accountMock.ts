import type { PatchOperation } from '@/services/PatchRecordService'
import type { Account, AccountRow, Address, Signatory, Deployment, ReferentialStructure, Hub } from '.'
import type { QueryResult } from '@/types/commonTypes'
import accountReferentialInformation from './__mock__/accountReferentialInformation.json'
import referentialHubs from './__mock__/referentialHubs.json'

export function getMockedAddress(override: Partial<Address> = {}): Address {
  const defaultAddress = {
    addressId: 2,
    addressLine1: 'Rue de liege',
    addressLine2: 'test 2',
    addressLine3: 'test 3',
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
    email: 'sign@kpmg.fr',
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
    address: getMockedAddress(),
    signatory: getMockedSignatory(),
    deployment: getMockedDeployment(),
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
