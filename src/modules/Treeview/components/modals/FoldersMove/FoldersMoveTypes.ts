import type { Folder } from '@/models/Folder'
import { Service } from '@/models/Service'
import { ExplorerDocument } from '@/modules/Documents/DocumentsTypes'

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

