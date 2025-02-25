import type { Entity } from '@pulse/common/types'

export const mockedEntity: Entity = {
  accountId: 1,
  legalName: 'Entity Test',
  accountNumber: 'IBS544G45F345F',
  color: 'orange',
}

export const entitiesMock: Entity[] = [
  {
    legalName: 'Entity Test 1',
    accountNumber: 'a1b2',
    accountId: 1,
    color: 'persian',
  },
  {
    legalName: 'Entity Test 2',
    accountNumber: 'b2c3',
    accountId: 2,
    color: 'orange',
  },
  {
    legalName: 'Entity Test 3',
    accountNumber: 'c3d4',
    accountId: 3,
    color: 'amethyste',
  },
]
