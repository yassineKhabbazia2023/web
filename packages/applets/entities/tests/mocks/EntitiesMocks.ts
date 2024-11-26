import type { Entity } from '@pulse/common/types'

export const entityMock: Entity = {
  legalName: 'Glagla land',
  accountNumber: 'a1b2',
  accountId: 1,
  color: 'persian',
}

export const entitiesMock: Entity[] = [
  {
    legalName: 'Glagla land',
    accountNumber: 'a1b2',
    accountId: 1,
    color: 'persian',
  },
  {
    legalName: 'Vitest est pas ouf',
    accountNumber: 'b2c3',
    accountId: 2,
    color: 'orange',
  },
  {
    legalName: 'Au5 Corp',
    accountNumber: 'c3d4',
    accountId: 3,
    color: 'amethyste',
  },
]
