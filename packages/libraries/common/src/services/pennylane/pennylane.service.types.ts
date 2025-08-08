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
  name: string
  path: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface PennylaneDocumentQueryResult extends QueryResult<PennylaneDocument> {
  lastSynchroDate: string
}
