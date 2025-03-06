import type { Entity, AccountRow } from '../stores/types'

export const accountsRowMock: AccountRow[] = [
  {
    accountId: 1000,
    accountGlobalUniqueId: 'guid-1000',
    accountNumber: '01000',
    legalName: 'Sanctum Eternal',
    isFavorite: false,
    address: {
      addressId: 10,
    },
    hub: {
      hubId: 100,
    },
    signatory: {
      contactId: 1000,
      globalContactId: 'guid-1000',
      firstName: 'Austin',
      lastName: 'Collins',
      email: 'a.collins@au5.fr',
      status: 'cool',
      personaName: 'Awesome Persona',
      creationDate: 'A long time ago in a galaxy far, far away....',
    },
    deployment: {
      deploymentId: 1000,
      status: 1,
    },
  },
  {
    accountId: 2000,
    accountGlobalUniqueId: 'guid-2000',
    accountNumber: '02000',
    legalName: 'Cheerleader',
    isFavorite: false,
    address: {
      addressId: 10,
    },
    hub: {
      hubId: 200,
    },
    signatory: {
      contactId: 2000,
      globalContactId: 'guid-2000',
      firstName: 'Porter',
      lastName: 'Robinson',
      email: 'p.robinson@smile.fr',
      status: 'cool',
      personaName: 'Awesome Persona',
      creationDate: 'A long time ago in a galaxy far, far away....',
    },
    deployment: {
      deploymentId: 2000,
      status: 1,
    },
  },
]

// This mocks is based on the accountsRowMock just above
export const entitiesFromAccountsRow: Entity[] = [
  {
    accountId: accountsRowMock[0].accountId,
    accountNumber: accountsRowMock[0].accountNumber,
    legalName: accountsRowMock[0].legalName,
    color: 'orange',
  },
  {
    accountId: accountsRowMock[1].accountId,
    accountNumber: accountsRowMock[1].accountNumber,
    legalName: accountsRowMock[1].legalName,
    color: 'orange',
  },
]