import type { PennylaneRole, PennylaneAvailableRole } from '../services/pennylane/pennylane.service.types'

export const getMockedPennylaneRole = (override: Partial<PennylaneRole> = {}) => {
  const defaultRecord: PennylaneRole = {
    accountId: 1,
    contactId: 2,
    role: 'admin',
  }

  return {
    ...defaultRecord,
    ...override,
  }
}

export const getMockedPennylaneAvailableRole = (override: Partial<PennylaneAvailableRole> = {}) => {
  const defaultRecord: PennylaneAvailableRole = {
    code: 'user',
    label: 'User Role',
    description: 'A standard user role',
  }

  return {
    ...defaultRecord,
    ...override,
  }
}
