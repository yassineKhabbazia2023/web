import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { ExplorerDocument } from '../../DocumentsTypes'
import type { Document } from '@/models/Document'

export interface DocumentMoveProps {
  folder: Folder
  isMoveModalOpened: boolean
  currentServiceFolder: Folder[]
  currentService: Service['ServiceId']
  selectedEntity: string
  selectedDocuments: Document[]
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
