import type { Entity, SelectedEntity } from '../stores/types'

export const getMockedUser = () => {
  return {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    isCustomer: false,
  }
}

export const getMockedUserPermissions = (): string[] => [
  'COADMI001',
  'COBank001',
  'COCAL001',
  'COEMB001',
  'COEVPO01',
  'COGED0001',
  'COGED0002',
]

export const getMockedEntities = (): Entity[] => [
  {
    accountId: 1,
    accountNumber: '2024643902',
    legalName: 'Test 1',
    color: 'orange',
  },
  {
    accountId: 2,
    accountNumber: '3524433298',
    legalName: 'Test 2',
    color: 'cyan',
  },
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
