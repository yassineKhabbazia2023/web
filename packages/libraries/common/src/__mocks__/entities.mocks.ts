import type { Entity, CurrentEntity } from '../stores/types'
import type { Permission } from '../types/permission.type'
import { CollaboratorPermission } from '../enums/permission.enum'
import { mockedEntitiesJsonData } from './entities.mocks.data'

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

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntitiesJsonData
}

export const getMockedCurrentEntity = (): CurrentEntity => {
  const permissions: Permission[] = [
    CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
    CollaboratorPermission.ACCEDER_ONGLET_INFORMATIONS,
    CollaboratorPermission.ACCEDER_ONGLET_UTILISATEURS,
  ]

  return {
    accountId: 1,
    accountNumber: '2024643902',
    legalName: 'Test 1',
    color: 'orange',
    permissions,
  }
}
