import type { PostSubscriptionRequest } from '@/services/subscription'

export const subscriptionDemandMock: PostSubscriptionRequest = {
  accountId: 1,
  applicant: 'john@example.com',
  contacts: [],
  offerId: 1,
  notes: [],
  productConfigurations: [1, 2, 3, 4],
}
