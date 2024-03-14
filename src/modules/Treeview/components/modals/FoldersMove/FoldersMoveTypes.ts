import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { ExplorerDocument } from '@/modules/Documents/DocumentsTypes'

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

