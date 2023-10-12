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
  HasSubscribedToVault: string
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

export interface DocumentsTableStructure {
  columnName: string
  relatedProperty: string
  fieldType: string
  nestedPropertyName: null | string
  ColumnOrder: number
}

export interface DocumentsWithTableStructure {
  documentsPage: {
    items: Document[]
  }
  documentHeaders: DocumentsTableStructure[]
}
