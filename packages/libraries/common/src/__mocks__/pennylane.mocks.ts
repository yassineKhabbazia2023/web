import type {
  PennylaneRole,
  PennylaneAvailableRole,
  PennylaneDocument,
  PennylaneDocumentQueryResult,
  PennylaneAccessResponse,
  PennylaneAccessTerm,
  PennylaneAccessAccount,
  PennylaneAccessDetails,
} from '../services/pennylane/pennylane.service.types'
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

export const getMockedPennylaneAccessTerm = (override: Partial<PennylaneAccessTerm> = {}): PennylaneAccessTerm => {
  const defaultRecord: PennylaneAccessTerm = {
    id: 1,
    linkFr: 'https://example.com/terms-fr',
  }

  return {
    ...defaultRecord,
    ...override,
  }
}

export const getMockedPennylaneAccessAccount = (
  override: Partial<PennylaneAccessAccount> = {},
): PennylaneAccessAccount => {
  const defaultRecord: PennylaneAccessAccount = {
    accountNumber: '2025546345',
    legalName: 'ACME Corporation SARL',
    planName: 'Premium Plan',
    planPriceExclTax: 99.99,
    compliancePriceExclTax: 49.99,
  }

  return {
    ...defaultRecord,
    ...override,
  }
}

export const getMockedPennylaneAccessDetails = (
  override: Partial<PennylaneAccessDetails> = {},
): PennylaneAccessDetails => {
  const defaultRecord: PennylaneAccessDetails = {
    id: 'detail-123',
    terms: getMockedPennylaneAccessTerm(),
    accounts: [getMockedPennylaneAccessAccount()],
  }

  return {
    ...defaultRecord,
    ...override,
  }
}

export const getMockedPennylaneAccessResponse = (
  override: Partial<PennylaneAccessResponse> = {},
): PennylaneAccessResponse => {
  const defaultRecord: PennylaneAccessResponse = {
    canAccess: true,
    isPennylaneSignatory: false,
    details: getMockedPennylaneAccessDetails(),
    freeTrialEndDate: '2026-10-31T00:00:00.00',
    billingMonth: 'novembre 2026',
  }

  return {
    ...defaultRecord,
    ...override,
  }
}
