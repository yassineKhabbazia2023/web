import { ProviderName } from '@entities/common/types/ProviderNameEnums'
import { SubscriptionPriceType } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'
import { ContactType } from '@entities/services/contact/contactTypes'
import type { SubscriptionDetails } from '@entities/services/subscription'

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
        providerName: ProviderName.PULSE,
        providerEditor: 'KPMG',
        providerCategory: 'PULSE',
        logoName: 'iconpulse-color',
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
      email: 'alice.durand@example.com',
    },
    {
      contactId: 25,
      firstName: 'Jannelle',
      lastName: 'Boyd',
      type: ContactType.Customer,
      email: 'janelle.boyd@example.com',
    },
  ],
  collaborators: [
    {
      contactId: 22,
      firstName: 'Jerry',
      lastName: 'Nantenaina',
      type: ContactType.Collaborator,
      email: 'jnantenaina@kpmg.fr',
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
