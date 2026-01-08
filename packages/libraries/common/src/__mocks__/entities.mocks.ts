import type { AccountRow, Signatory, Hub, Deployment, Address } from '../types/account.types'
import type { Entity, CurrentEntity, MockEntityKey, MockUserContact } from '../types/entities.type'
import type { Permission } from '../types/permission.type'
import { CollaboratorPermission } from '../enums/permission.enum'

/**
 * Mock entity IDs used across all tests
 */
export const MockEntityId = {
  /** Acme Corp - Basic entity with standard permissions */
  BASIC: 601,
  /** Tech Solutions Ltd - Entity with legacy GED */
  LEGACY_GED: 602,
  /** Global Services Inc - Entity with Pennylane subscription */
  PENNYLANE: 603,
} as const

/**
 * Standard mock entity data used across all tests
 * These 3 entities represent the canonical test scenarios:
 * - BASIC: Simple entity with minimal features
 * - LEGACY: Entity with legacy GED access
 * - PENNYLANE: Entity with Pennylane integration
 */
export const MockEntityData = {
  BASIC: {
    accountId: MockEntityId.BASIC,
    accountGlobalUniqueId: '5f85e793-57c0-4da6-b821-3b2888567256',
    accountNumber: 'V900000547',
    legalName: 'Acme Corp',
    color: 'orange' as const,
  },
  LEGACY_GED: {
    accountId: MockEntityId.LEGACY_GED,
    accountGlobalUniqueId: '5f85e793-57c0-4da6-b821-3b2888567255',
    accountNumber: 'V900000546',
    legalName: 'Tech Solutions Ltd',
    color: 'persian' as const,
  },
  PENNYLANE: {
    accountId: MockEntityId.PENNYLANE,
    accountGlobalUniqueId: '5f85e793-57c0-4da6-b821-3b2888567254',
    accountNumber: 'V900000545',
    legalName: 'Global Services Inc',
    color: 'cyan' as const,
  },
} as const

/**
 * Get mock signatory for an entity
 */
export function getMockSignatory(entityKey: MockEntityKey): Signatory {
  const signatories: Record<MockEntityKey, Signatory> = {
    BASIC: {
      contactId: 41,
      globalContactId: 'global-contact-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      status: 'active',
      personaName: 'Dirigeant',
      creationDate: '2024-01-01',
    },
    LEGACY_GED: {
      contactId: 42,
      globalContactId: 'global-contact-2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@techsolutions.com',
      status: 'active',
      personaName: 'Dirigeant',
      creationDate: '2024-01-01',
    },
    PENNYLANE: {
      contactId: 43,
      globalContactId: 'global-contact-3',
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson@globalservices.com',
      status: 'active',
      personaName: 'Dirigeant',
      creationDate: '2024-01-01',
    },
  }
  return signatories[entityKey]
}

/**
 * Get full AccountRow for an entity
 */
export function getMockAccountRow(entityKey: MockEntityKey): AccountRow {
  const entity = MockEntityData[entityKey]
  return {
    accountId: entity.accountId,
    accountGlobalUniqueId: entity.accountGlobalUniqueId,
    accountNumber: entity.accountNumber,
    legalName: entity.legalName,
    isFavorite: entityKey === 'LEGACY_GED',
    address: getMockAddress(entityKey),
    hub: getMockHub(entityKey),
    signatory: getMockSignatory(entityKey),
    deployment: getMockDeployment(entityKey),
  }
}

/**
 * Get all 3 standard AccountRows
 */
export function getAllMockAccountRows(): AccountRow[] {
  return [
    getMockAccountRow('BASIC'),
    getMockAccountRow('LEGACY_GED'),
    getMockAccountRow('PENNYLANE'),
  ]
}

/**
 * Get mock address for an entity
 */
export function getMockAddress(entityKey: MockEntityKey): Address {
  const addresses: Record<MockEntityKey, Address> = {
    BASIC: {
      addressId: 11,
      addressLine1: '123 Main Street',
      addressLine2: 'Suite 100',
      addressType: 'billing',
      city: 'Paris',
      zipCode: '75001',
      country: 'France',
    },
    LEGACY_GED: {
      addressId: 12,
      addressLine1: '456 Tech Avenue',
      addressLine2: 'Floor 5',
      addressType: 'billing',
      city: 'Lyon',
      zipCode: '69001',
      country: 'France',
    },
    PENNYLANE: {
      addressId: 13,
      addressLine1: '789 Global Plaza',
      addressLine2: 'Building A',
      addressType: 'billing',
      city: 'Marseille',
      zipCode: '13001',
      country: 'France',
    },
  }
  return addresses[entityKey]
}

/**
 * Get mock hub for an entity
 */
export function getMockHub(entityKey: MockEntityKey): Hub {
  const hubs: Record<MockEntityKey, Hub> = {
    BASIC: {
      hubId: 21,
      hubName: 'Hub Ile-de-France',
    },
    LEGACY_GED: {
      hubId: 22,
      hubName: 'Hub Rhone-Alpes',
    },
    PENNYLANE: {
      hubId: 23,
      hubName: 'Hub PACA',
    },
  }
  return hubs[entityKey]
}

/**
 * Get mock deployment for an entity
 */
export function getMockDeployment(entityKey: MockEntityKey): Deployment {
  const deployments: Record<MockEntityKey, Deployment> = {
    BASIC: {
      deploymentId: 31,
      deploymentDate: '2024-01-15',
      status: 1,
    },
    LEGACY_GED: {
      deploymentId: 32,
      deploymentDate: '2024-02-01',
      status: 1,
    },
    PENNYLANE: {
      deploymentId: 33,
      deploymentDate: '2024-03-01',
      status: 1,
    },
  }
  return deployments[entityKey]
}

/**
 * Get mock user client account (primary contact) for an entity
 */
export function getMockUserClientAccount(entityKey: MockEntityKey): MockUserContact {
  const signatory = getMockSignatory(entityKey)
  return {
    contactId: signatory.contactId,
    contactGlobalUniqueId: signatory.globalContactId,
    firstName: signatory.firstName,
    lastName: signatory.lastName,
    email: signatory.email,
    status: 'Declared',
    personaName: 'ADMIN/Dirigeant',
    creationDate: signatory.creationDate,
  }
}

/**
 * Get mock users list for an entity
 * Returns a list of users associated with the entity
 */
export function getMockUsersList(entityKey: MockEntityKey): MockUserContact[] {
  const primaryContact = getMockUserClientAccount(entityKey)
  const entity = MockEntityData[entityKey]
  const baseId = entity.accountId * 100

  return [
    { ...primaryContact, status: 'Connected' },
    {
      contactId: baseId + 1,
      contactGlobalUniqueId: `user-${entityKey.toLowerCase()}-1`,
      firstName: 'Alice',
      lastName: 'Martin',
      email: `alice.martin@${entity.legalName.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'Connected',
      personaName: 'Comptable',
      creationDate: '2024-03-15',
    },
    {
      contactId: baseId + 2,
      contactGlobalUniqueId: `user-${entityKey.toLowerCase()}-2`,
      firstName: 'Marc',
      lastName: 'Dupont',
      email: `marc.dupont@${entity.legalName.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'Invited',
      personaName: 'Gestionnaire',
      creationDate: '2024-05-10',
    },
    {
      contactId: baseId + 3,
      contactGlobalUniqueId: `user-${entityKey.toLowerCase()}-3`,
      firstName: 'Sophie',
      lastName: 'Bernard',
      email: `sophie.bernard@${entity.legalName.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'Declared',
      personaName: 'Collaborateur',
      creationDate: '2024-06-01',
    },
  ]
}

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
