import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { ExplorerDocument } from '../../DocumentsTypes'
import type { Document } from '@ged/models/Document'

export interface DocumentMoveProps {
  folder: Folder
  isMoveModalOpened: boolean
  currentServiceFolder: Folder[]
  currentService: Service['ServiceId']
  currentEntity: string
  selectedDocuments: Document[]
  accountId: number
}

export interface ExplorerMoveDocument extends ExplorerDocument {
  id: string
}

export interface MoveDocumentsRequest {
  ids: string[]
  sourceFolderId: number
  destinationFolderId: number
  moveAll: boolean
  serviceId: string
}
