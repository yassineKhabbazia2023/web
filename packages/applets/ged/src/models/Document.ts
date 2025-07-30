import type { Service } from './Service'
import type { Folder as FolderModel } from './Folder'
import type { DocumentSearchFilters } from './DocumentSearchFilters'

interface Content {
  href: string
}

interface Preview {
  href: string
}

interface Folder {
  id: number
  path: string[]
}

interface Account {
  id: string
  name: string
}

interface Properties {
  syncStatus: string
  HasSubscribedToVault?: string
}

interface Source {
  id: number
  code: string
  libelle: string
}

interface PiaStatus {
  technicalName: any
  labelFr: any
  labelEn: any
  date: any
}

export interface Document {
  id: string
  name: string
  content: Content
  preview: Preview
  updatedBy: string
  updated: string
  type: string
  size: number
  comments: any
  isUploadedInGedLoop: null | boolean
  folder: Folder
  created: string
  createdBy: string
  account: Account
  properties: Properties
  lifecycleStatus: string
  paymentStatus: any
  source: Source
  piaStatus: PiaStatus
  permissions: string[]
  isNew: any
}

export interface BinDocument {
  id: Document['id']
  name: Document['name']
  deleted: string
  path: string[]
}

export interface RestoredDocument {
  id: string
  folderId: number
}

export interface DocumentsTableStructure {
  columnName: string
  relatedProperty: string
  secondRelatedProperty?: string
  fieldType: string
  nestedPropertyName: null | string
  columnOrder: number
}

export interface GenericDocumentsWithTableStructure<T> {
  documentsPage: {
    items: T[]
    totalItems: number
    endIndex: number
    startIndex: number
  }
  documentHeaders: DocumentsTableStructure[]
}

export type DocumentsWithTableStructure = GenericDocumentsWithTableStructure<Document>
export type BinDocumentsWithTableStructure = GenericDocumentsWithTableStructure<BinDocument>
export interface TableRowDocument extends Document {
  _rowIndex: number
}

// This response comes from signalR notification
// Once the document PIA Status changes, it's permisions change too
export interface DocumentStatusUpdateResponse {
  folderId: number
  documentId: string
  newStatus: PiaStatus
  permissions: string[]
}

export interface Coordinate {
  x: number
  y: number
}

export interface FetchDocumentsParams {
  serviceId: Service['ServiceId']
  folderId: FolderModel['id']
  entityId: string
  accountId: number
  skip?: number
  limit?: number
  sort?: string
  filters?: DocumentSearchFilters | null
}

export interface FetchDocumentsByKeyWordParams {
  serviceId: Service['ServiceId']
  folderId: FolderModel['id']
  entityId: string
  accountId: number
  skip: number
  limit: number
  sort: string
  search: string
  findInChildFolders?: boolean
}
