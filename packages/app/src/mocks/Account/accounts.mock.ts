// eslint-disable-next-line import/extensions
import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'

export const accountMock: NotificationAccount = {
  id: 1,
  name: 'Au5',
  accountNumber: 100,
}

export const accountsMock: NotificationAccount[] = [
  {
    ...accountMock,
  },
  {
    id: 2,
    name: 'Monstercat',
    accountNumber: 200,
  },
  {
    id: 3,
    name: 'Virtual Riot',
    accountNumber: 300,
  },
  {
    id: 4,
    name: 'Haywyre',
    accountNumber: 400,
  },
  {
    id: 5,
    name: 'Porter Robinson',
    accountNumber: 500,
  },
  {
    id: 6,
    name: 'KOAN Sound',
    accountNumber: 600,
  },
]
