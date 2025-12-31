import type { Entity, CurrentEntity } from '../types/entities.type'
import type { Permission } from '../types/permission.type'
import { CollaboratorPermission } from '../enums/permission.enum'
import { MockEntityData } from './entities.constants'

export const MOCKED_ENTITY_DEFAULTS = {
  accountId: MockEntityData.BASIC.accountId,
  accountNumber: MockEntityData.BASIC.accountNumber,
  legalName: MockEntityData.BASIC.legalName,
  color: MockEntityData.BASIC.color,
} as const

export const getMockedEntity = (overridden: Partial<Entity> = {}): Entity => {
  return {
    ...MOCKED_ENTITY_DEFAULTS,
    ...overridden,
  }
}

export const getMockedEntities = (): Entity[] => [
  {
    accountId: MockEntityData.BASIC.accountId,
    accountNumber: MockEntityData.BASIC.accountNumber,
    legalName: MockEntityData.BASIC.legalName,
    color: MockEntityData.BASIC.color,
  },
  {
    accountId: MockEntityData.LEGACY_GED.accountId,
    accountNumber: MockEntityData.LEGACY_GED.accountNumber,
    legalName: MockEntityData.LEGACY_GED.legalName,
    color: MockEntityData.LEGACY_GED.color,
  },
  {
    accountId: MockEntityData.PENNYLANE.accountId,
    accountNumber: MockEntityData.PENNYLANE.accountNumber,
    legalName: MockEntityData.PENNYLANE.legalName,
    color: MockEntityData.PENNYLANE.color,
  },
]

export const getMockedFavoriteEntities = (): Entity[] => {
  return getMockedEntities()
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
