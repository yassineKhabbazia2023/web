import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { ExplorerDocument } from '../../DocumentsTypes'

export interface DocumentUploadProps {
  folder: Folder
  isUploadModalOpened: boolean
  currentServiceFolder: Folder[]
  currentService: Service['ServiceId']
  selectedEntity: string
  files: File[]
}

export interface ExplorerUploadDocument extends ExplorerDocument {
  file: File
}
