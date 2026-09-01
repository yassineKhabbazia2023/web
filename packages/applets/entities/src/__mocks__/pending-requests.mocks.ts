import { DelegationRequestStatus } from '@entities/enums'
import type { DelegationRequestApiItem } from '@entities/services/account/account.type'

export function getMockedDelegationRequestApiItems(): DelegationRequestApiItem[] {
  return [
    {
      delegationRequestId: 1,
      requesterId: 10,
      recipientId: 20,
      accountId: 100,
      createdAt: '2026-02-25T14:00:52.9815022',
      status: DelegationRequestStatus.PENDING,
      requester: {
        contactId: 10,
        firstName: 'John',
        lastName: 'DOE',
        email: 'john.doe@example.com',
        isActive: true,
        actionLevel: 0,
      },
      account: {
        accountId: 100,
        accountNumber: '1234567890',
        legalName: 'ACME Corp',
        isClarityVisible: false,
        isSignatory: false,
      },
    },
  ]
}
