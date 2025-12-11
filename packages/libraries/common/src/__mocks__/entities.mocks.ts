import type { Entity, CurrentEntity } from '../stores/types'
import type { Permission } from '../types/permission.type'
import { CollaboratorPermission } from '../enums/permission.enum'
import { mockedEntitiesJsonData } from './entities.mocks.data'

export const MOCKED_ENTITY_DEFAULTS = {
  accountId: 1337,
  accountNumber: '1234567890',
  legalName: 'Boulangerie Bel Epi',
  color: 'orange',
} as const

export const getMockedEntity = (overridden: Partial<Entity> = {}): Entity => {
  return {
    ...MOCKED_ENTITY_DEFAULTS,
    ...overridden,
  }
}

export const getMockedEntities = (): Entity[] => [
  getMockedEntity(),
  getMockedEntity({
    accountId: 1338,
    accountNumber: '1234567891',
    legalName: 'Pâtisserie Belle Étoile',
    color: 'cyan',
  }),
]

export const getMockedFavoriteEntities = (): Entity[] => {
  return mockedEntitiesJsonData
}

export const getMockedCurrentEntity = (overridden: Partial<CurrentEntity> = {}): CurrentEntity => {
  const permissions: Permission[] = [
    CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
    CollaboratorPermission.ACCEDER_ONGLET_INFORMATIONS,
    CollaboratorPermission.ACCEDER_ONGLET_UTILISATEURS,
  ]

  return {
    ...MOCKED_ENTITY_DEFAULTS,
    permissions,
    ...overridden,
  }
}
