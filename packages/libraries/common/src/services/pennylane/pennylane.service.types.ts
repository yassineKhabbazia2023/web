import type { QueryResult } from '@pulse/common/types'

export interface PennylaneRole {
  accountId: number
  contactId: number
  role: string
}

export interface PennylaneAvailableRole {
  code: string
  label: string
  description: string
}

export interface PennylaneDocument {
  id: number
  name: string
  path: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface PennylaneDocumentQueryResult extends QueryResult<PennylaneDocument> {
  lastSynchroDate: string
}

export interface PennylaneAccessTerm {
  id: number
  linkFr: string
}

export interface PennylaneAccessAccount {
  accountNumber: string
  legalName: string
  planName: string
  planPriceExclTax: number
  compliancePriceExclTax: number
}

export interface PennylaneAccessDetails {
  id: string
  terms: PennylaneAccessTerm
  accounts: PennylaneAccessAccount[]
}

export interface PennylaneAccessResponse {
  canAccess: boolean
  isPennylaneSignatory?: boolean
  details?: PennylaneAccessDetails
}
