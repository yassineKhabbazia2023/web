import type { PennylaneRole, PennylaneAvailableRole, PennylaneDocument, PennylaneDocumentQueryResult } from '../services/pennylane/pennylane.service.types'
import { getMockedQueryResult } from './query-result.mocks'

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

export const getMockedPennylaneDocument = (override: Partial<PennylaneDocument> = {}) => {
  const defaultRecord: PennylaneDocument = {
    id: 1,
    name: 'Header.png',
    path: '/Dossier permanent/00 - Publications',
    url: 'placeholder.pdf',
    createdAt: '2025-08-04T12:51:56.78',
    updatedAt: '2025-08-04T12:51:56.78',
  }

  return {
    ...defaultRecord,
    ...override,
  }
}

export function getMockedPennylaneDocumentsQueryResult(override: Partial<PennylaneDocumentQueryResult> = {}) {
  return {
    ...getMockedQueryResult<PennylaneDocument>(),
    lastSynchroDate: '2025-08-05T08:57:18.6151591+02:00',
    ...override,
  }
}
