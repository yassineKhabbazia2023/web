import {
  type PostSubscriptionRequest,
  type SubscriptionDetails,
  type SubscriptionRequest,
  SubscriptionStatusCode,
} from '@entities/services/subscription/subscriptionTypes'
import type { PaginationResponse } from '@pulse/common/types'
import { ProviderName, SubscriptionPriceType } from '@entities/enums'

import { ContactType } from '@pulse/common/enums'

export const validatedSubscriptionRequestMock: SubscriptionRequest = {
  subscriptionId: 13,
  account: {
    accountId: 5,
    accountNumber: '1000265308',
    accountLegalName: 'JOHN SMITH',
  },
  applicant: 'test-03@test.fr',
  offer: {
    offerId: 6,
    offerCode: 'Pennylane',
    offerLabel: "Mise à disposition de l'outil Pennylane alliée à l'expertise de RYDGE",
    offerName: 'RYDGE Conseil x Pennylane',
    logoName: 'pennylane-color',
    plans: [
      {
        planId: 10,
        planCode: 'PENNYLANE_BASIQUE',
        planName: 'Basique',
        isDefault: true,
        isSelected: true,
        pricings: [
          {
            planPricingId: 10,
            price: 0,
            priceType: 'mois HT',
            label: 'Gratuit',
            isSelected: true,
          },
        ],
      },
      {
        planId: 11,
        planCode: 'PENNYLANE_ESSENTIEL',
        planName: 'Essentiel',
        isDefault: false,
        isSelected: false,
        pricings: [
          {
            planPricingId: 11,
            price: 29,
            priceType: 'mois HT',
            label: '1 utilisateur',
            isSelected: false,
          },
        ],
      },
    ],
  },
  clients: [
    {
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test-05@test.onmicrosoft.com',
      mobilePhone: '1234567P',
    },
  ],
  subscriptionDate: '2023-03-30T12:32:29.9400933',
  creationDate: '2023-03-30T12:32:29.9400933',
  status: SubscriptionStatusCode.VALIDATED,
}

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
      offerName: 'Mes modules de gestion : RCA MEG Smart',
      logoName: 'meg',
      plans: [
        {
          planId: 1,
          planCode: 'MEG_BASIC',
          planName: 'MEG Basic',
          isDefault: true,
          isSelected: false,
          pricings: [
            {
              planPricingId: 1,
              price: 0,
              priceType: 'mois HT',
              label: 'Gratuit',
              isSelected: false,
            },
          ],
        },
        {
          planId: 2,
          planCode: 'MEG_PREMIUM',
          planName: 'MEG Premium',
          isDefault: false,
          isSelected: true,
          pricings: [
            {
              planPricingId: 2,
              price: 49,
              priceType: 'mois HT',
              label: '1 utilisateur',
              isSelected: true,
            },
            {
              planPricingId: 3,
              price: 99,
              priceType: 'mois HT',
              label: '3 utilisateurs',
              isSelected: false,
            },
          ],
        },
      ],
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
      accountLegalName: 'JOHN SMITH',
    },
    applicant: 'test-03@test.fr',
    offer: {
      offerId: 6,
      offerCode: 'Pennylane',
      offerLabel: "Mise à disposition de l'outil Pennylane alliée à l'expertise de RYDGE",
      offerName: 'RYDGE Conseil x Pennylane',
      logoName: 'pennylane-color',
      plans: [
        {
          planId: 10,
          planCode: 'PENNYLANE_BASIQUE',
          planName: 'Basique',
          isDefault: true,
          isSelected: true,
          pricings: [
            {
              planPricingId: 10,
              price: 0,
              priceType: 'mois HT',
              label: 'Gratuit',
              isSelected: true,
            },
          ],
        },
        {
          planId: 11,
          planCode: 'PENNYLANE_ESSENTIEL',
          planName: 'Essentiel',
          isDefault: false,
          isSelected: false,
          pricings: [
            {
              planPricingId: 11,
              price: 29,
              priceType: 'mois HT',
              label: '1 utilisateur',
              isSelected: false,
            },
          ],
        },
      ],
    },
    clients: [
      {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        email: 'test-05@test.onmicrosoft.com',
        mobilePhone: '1234567P',
      },
    ],
    subscriptionDate: '2023-03-30T12:32:29.9400933',
    creationDate: '2023-03-30T12:32:29.9400933',
    status: SubscriptionStatusCode.VALIDATED,
  },
]

export function getMockedSubscriptionDetails(override: Partial<SubscriptionDetails> = {}) {
  const defaultSubscriptionDetails: SubscriptionDetails = {
    subscriptionId: 12,
    account: {
      accountId: 62,
      accountNumber: '2024705285',
      accountLegalName: 'Jane Smith',
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
      functions: [],
    },
    clients: [
      {
        contactId: 56,
        firstName: 'Jane',
        lastName: 'Doe',
        type: ContactType.CUSTOMER,
        email: 'jane.doe@test.fr',
      },
      {
        contactId: 25,
        firstName: 'Emily',
        lastName: 'Johnson',
        type: ContactType.CUSTOMER,
        email: 'emily.johnson@test.fr',
      },
    ],
    collaborators: [
      {
        contactId: 22,
        firstName: 'Bob',
        lastName: 'Wilson',
        type: ContactType.COLLABORATOR,
        email: 'bob.wilson@test.fr',
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
    hasNoSiren: false,
  }

  return {
    ...defaultSubscriptionDetails,
    ...override,
  }
}

export function getMockedSubscriptionPaginationResponse(
  override: Partial<PaginationResponse<SubscriptionRequest>> = {},
): PaginationResponse<SubscriptionRequest> {
  return {
    items: subscriptionRequestMock,
    currentPage: 1,
    totalItems: subscriptionRequestMock.length,
    totalPages: 1,
    ...override,
  }
}

export const subscriptionDemandMock: PostSubscriptionRequest = {
  accountId: 1,
  applicant: 'john@example.com',
  contacts: [],
  offerId: 1,
  notes: [],
  productConfigurations: [1, 2, 3, 4],
}
