import type { PermanentDelegationApiItem } from '@entities/services/account/account.type'

export function getMockedPermanentDelegationApiItems(): PermanentDelegationApiItem[] {
  return [
    {
      delegationId: 100,
      startDate: '2026-02-25T14:00:52.9815022',
      delegatee: {
        contactId: 1,
        firstName: 'John',
        lastName: 'DOE',
        email: 'john.doe@example.com',
      },
    },
    {
      delegationId: 200,
      startDate: '2026-02-24T14:22:51.0629012',
      delegatee: {
        contactId: 2,
        firstName: 'Jane',
        lastName: 'SMITH',
        email: 'jane.smith@example.com',
      },
    },
  ]
}
