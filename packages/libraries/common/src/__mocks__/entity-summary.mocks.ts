import type { Office, Deployment, Subscription, Address, EntitySummary } from '@common/types'
import { AccountType } from '../enums/account-type.enum'
import { MockEntityData } from './entities.mocks'

const address: Address = {
  addressId: MockEntityData.BASIC.accountId,
  addressLine1: '2 avenue Gambetta',
  addressLine2: 'Tour Eqho',
  addressLine3: '',
  state: '',
  zipCode: '92400',
  country: 'France',
  city: 'Courbevoie',
  addressType: 'delivery',
  latitude: 48.884810,
  longitude: 2.236140,
}

const office: Office = {
  officeId: 100,
  name: 'Paris La Défense - Courbevoie',
  phoneNumber: 'Numéro non trouvé',
  addressId: MockEntityData.BASIC.accountId,
  address,
}

const deployment: Deployment = {
  deploymentId: MockEntityData.BASIC.accountId,
  deploymentDate: '2024-09-26T15:16:13.7406315',
  status: 3,
}

export function getMockedSubscription(override: Partial<Subscription> = {}): Subscription {
  const subscriptionMock: Subscription = {
    subscriptionId: 480,
    offerId: 1,
    status: 'validated',
    accountId: MockEntityData.BASIC.accountId,
    offerCode: 'MEG Smart',
    offerName: 'Mes modules de gestion : RCA MEG Smart',
    creationDate: '2025-07-11T12:03:15.5724735',
    validator: 'someone@test.fr',
  }

  return {
    ...subscriptionMock,
    ...override,
  }
}

const subscriptions: Subscription[] = [
  getMockedSubscription(),
  {
    subscriptionId: 481,
    offerId: 5,
    status: 'validated',
    accountId: MockEntityData.BASIC.accountId,
    offerCode: 'Silae Externalisation',
    offerName: 'Externalisation de la paie',
    creationDate: '2025-07-21T17:44:48.953619',
  },
  {
    subscriptionId: 504,
    offerId: 8,
    status: 'validated',
    accountId: MockEntityData.BASIC.accountId,
    offerCode: 'Pennylane',
    offerName: 'RYDGE Conseil x Pennylane',
    creationDate: '2025-07-28T14:23:59.6203772',
    validator: 'migration',
  },
]

export const entitySummaryMock: EntitySummary = {
  accountId: MockEntityData.BASIC.accountId,
  accountGlobalUniqueId: MockEntityData.BASIC.accountGlobalUniqueId,
  accountNumber: MockEntityData.BASIC.accountNumber,
  legalName: MockEntityData.BASIC.legalName,
  accountType: AccountType.REGULAR,
  missionType: 'Revision',
  officeId: 100,
  office,
  address,
  deployment,
  subscriptions,
  prospectId: null,
}

export function getMockedEntitySummary(override: Partial<EntitySummary> = {}): EntitySummary {
  return {
    ...entitySummaryMock,
    ...override,
  }
}
