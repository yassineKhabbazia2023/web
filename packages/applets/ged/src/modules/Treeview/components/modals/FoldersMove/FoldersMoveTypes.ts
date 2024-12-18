import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { ExplorerDocument } from '@ged/modules/Documents/DocumentsTypes'

export interface FoldersMoveProps {
  folder: Folder
  isMoveModalOpened: boolean
  currentServiceFolder: Folder[]
  currentService: Service['ServiceId']
  selectedEntity: string
  folderToMove: Folder
}

export interface ExplorerMoveFolder extends ExplorerDocument {
  folder: Folder
}
