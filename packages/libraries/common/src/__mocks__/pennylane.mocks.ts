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
    name: 'Header.png',
    path: '/Dossier permanent/00 - Publications',
    url: 'https://sandbox.pennylane.com/rails/active_storage/blobs/redirect/zICBpl9yYWlsc4OkZGF0Yc4BFb%2Feo2V4cMcLB85okNo1ziumNfIAo3B1cqdibG9iX2lk--25ba2372333c0f73b6a1c296776959dd183ddbf9/Header.png',
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
