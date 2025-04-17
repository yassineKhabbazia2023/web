import type { Entity, SelectedEntity } from '../stores/types'

export const getMockedEntity = (overridden: Partial<Entity> = {}) => {
  const defaultEntity: Entity = {
    accountId: 1,
    accountNumber: '2024643902',
    legalName: 'Test 1',
    color: 'orange',
  }

  return {
    ...defaultEntity,
    ...overridden,
  }
}

export const getMockedEntities = (): Entity[] => [
  getMockedEntity(),
  getMockedEntity({
    accountId: 2,
    accountNumber: '3524433298',
    legalName: 'Test 2',
    color: 'cyan',
  }),
]

export const getMockedSelectedEntity = (): SelectedEntity => {
  return {
    accountId: 1,
    accountNumber: '2024643902',
    legalName: 'Test 1',
    color: 'orange',
    permissions: ['COUSER002', 'COINFO001', 'COUSER001'],
  }
}
