import { SubscriptionRequest } from '../SubscriptionsTypes'

export const subscriptionRequestMock: SubscriptionRequest[] = [
  {
    subscriptionId: 11,
    account: {
      globalAccountId: 'fc50198f-4830-48ca-9afe-0a67b2c53455',
      accountNumber: 'V900000163',
      accountLabel: 'Test Indicators 1'
    },
    applicant: 'test-01@kpmg.fr',
    offer: {
      globalOfferId: '04d364de-dd6a-4fc3-9478-ba14c0e35820',
      offerLabel: 'Pennylane'
    },
    users: [{
      globalUserId: '1',
      firstName: 'TFirsName',
      lastName: 'TLastName',
      email: 'TLastName+test@kpmg.onmicrosoft.com'
    }],
    subscriptionDate: '2023-03-24T10:05:01.6104084',
    creationDate: '2023-03-24T10:05:01.6104084',
    statusCode: 'Pending'
  },
  {
    subscriptionId: 13,
    account: {
      globalAccountId: '93012cc8-77b9-4161-8dbd-61915d935e21',
      accountNumber: '1000265308',
      accountLabel: 'JEAN LÉVAGE'
    },
    applicant: 'test-03@kpmg.fr',
    offer: {
      globalOfferId: '04d364de-dd6a-4fc3-9478-ba14c0e35820',
      offerLabel: 'Pennylane'
    },
    users: [{
      globalUserId: '2',
      firstName: 'Suliman',
      lastName: 'Test',
      email: 'test-05@kpmg.onmicrosoft.com'
    }],
    subscriptionDate: '2023-03-30T12:32:29.9400933',
    creationDate: '2023-03-30T12:32:29.9400933',
    statusCode: 'Pending'
  }
]
