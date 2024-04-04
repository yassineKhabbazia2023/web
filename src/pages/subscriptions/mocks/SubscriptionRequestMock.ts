import {
  type SubscriptionRequest,
  SubscriptionStatusCode,
} from '@/services/subscription'

export const subscriptionRequestMock: SubscriptionRequest[] = [
  {
    subscriptionId: 11,
    account: {
      accountId: 5,
      accountNumber: 'V900000163',
      accountLegalName: 'Test Indicators 1',
    },
    applicant: 'test-01@kpmg.fr',
    offer: {
      offerId: 5,
      offerLabel: 'Pennylane',
    },
    clients: [
      {
        id: 1,
        firstName: 'TFirsName',
        lastName: 'TLastName',
        email: 'TLastName+test@kpmg.onmicrosoft.com',
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
    applicant: 'test-03@kpmg.fr',
    offer: {
      offerId: 6,
      offerLabel: 'Pennylane',
    },
    clients: [
      {
        id: 2,
        firstName: 'Suliman',
        lastName: 'Test',
        email: 'test-05@kpmg.onmicrosoft.com',
      },
    ],
    subscriptionDate: '2023-03-30T12:32:29.9400933',
    creationDate: '2023-03-30T12:32:29.9400933',
    status: SubscriptionStatusCode.PENDING,
  },
]
