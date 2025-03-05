import {
  type PostSubscriptionRequest,
  type SubscriptionDetails ,
  type SubscriptionRequest,
  SubscriptionStatusCode,
} from '@entities/services/subscription/subscriptionTypes'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'
import { SubscriptionPriceType } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'
import { ContactType } from '@entities/services/contact/contactTypes'

export const subscriptionRequestMock: SubscriptionRequest[] = [
  {
    subscriptionId: 11,
    account: {
      accountId: 5,
      accountNumber: 'V900000163',
      accountLegalName: 'Test Indicators 1',
    },
    applicant: 'test-01@test.fr',
    offer: {
      offerId: 5,
      offerCode: 'MEG Smart',
      offerLabel: 'Modules MEG : facturation et caisse',
    },
    clients: [
      {
        id: 1,
        firstName: 'TFirsName',
        lastName: 'TLastName',
        email: 'TLastName+test@test.onmicrosoft.com',
        mobilePhone: '1234567P',
      },
    ],
    subscriptionDate: '2023-03-24T10:05:01.6104084',
    creationDate: '2023-03-24T10:05:01.6104084',
    status: SubscriptionStatusCode.PENDING,
  },
  {
    subscriptionId: 13,
    account: {
      accountId: 5,
      accountNumber: '1000265308',
      accountLegalName: 'JEAN LÉVAGE',
    },
    applicant: 'test-03@test.fr',
    offer: {
      offerId: 6,
      offerCode: 'Pennylane',
      offerLabel: "Mise à disposition de l'outil Pennylane alliée à l'expertise de RYDGE",
    },
    clients: [
      {
        id: 2,
        firstName: 'Suliman',
        lastName: 'Test',
        email: 'test-05@test.onmicrosoft.com',
        mobilePhone: '1234567P',
      },
    ],
    subscriptionDate: '2023-03-30T12:32:29.9400933',
    creationDate: '2023-03-30T12:32:29.9400933',
    status: SubscriptionStatusCode.PENDING,
  },
]

export const getMockedSubscriptionDetails = (): SubscriptionDetails => ({
  subscriptionId: 12,
  account: {
    accountId: 62,
    accountNumber: '2024705285',
    accountLegalName: 'Armani Conway',
  },
  offer: {
    offerId: 1,
    offerName: 'Mes modules de gestion : RCA MEG Smart',
    offerLabel: 'Modules MEG : facturation et caisse',
    offerPrice: 0,
    offerCode: 'MEG Smart',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'meg',
    providers: [
      {
        providerName: ProviderName.RYDGE,
        providerEditor: 'RYDGE',
        providerCategory: 'RYDGE',
        logoName: 'brand-color',
        products: [
          {
            productConfigurationId: 1,
            productName: 'GED Compta',
            productLabel: 'GED Comptabilité',
            enabled: true,
            isOptionnal: false,
            price: 0,
            priceType: SubscriptionPriceType.free,
            isSelected: true,
          },
        ],
      },
      {
        providerName: ProviderName.MEG,
        providerEditor: 'RCA',
        providerCategory: 'external',
        logoName: 'meg',
        products: [
          {
            productConfigurationId: 2,
            productName: 'Accès MEG',
            productLabel: "Accès à l'outil MEG",
            enabled: true,
            isOptionnal: false,
            price: 0,
            priceType: SubscriptionPriceType.free,
            isSelected: true,
          },
          {
            productConfigurationId: 3,
            productName: 'Module caisse',
            productLabel: 'Module caisse de MEG',
            enabled: true,
            isOptionnal: true,
            price: 0,
            priceType: SubscriptionPriceType.free,
            isSelected: false,
          },
        ],
      },
    ],
  },
  clients: [
    {
      contactId: 56,
      firstName: 'Alice',
      lastName: 'Durand',
      type: ContactType.Customer,
      email: 'alice.durand@test.fr',
    },
    {
      contactId: 25,
      firstName: 'Jannelle',
      lastName: 'Boyd',
      type: ContactType.Customer,
      email: 'janelle.boyd@test.fr',
    },
  ],
  collaborators: [
    {
      contactId: 22,
      firstName: 'Jerry',
      lastName: 'Nantenaina',
      type: ContactType.Collaborator,
      email: 'jnantenaina@test.fr',
    },
  ],
  notes: [
    {
      stepName: 'services',
      stepNote: 'Services Note Test',
    },
    {
      stepName: 'customers',
      stepNote: 'Customers Note Test',
    },
    {
      stepName: 'collaborators',
      stepNote: 'Collaborators Note Test',
    },
    {
      stepName: 'information',
      stepNote: 'Information Note Test',
    },
  ],
})

export const subscriptionDemandMock: PostSubscriptionRequest = {
  accountId: 1,
  applicant: 'john@example.com',
  contacts: [],
  offerId: 1,
  notes: [],
  productConfigurations: [1, 2, 3, 4],
}
