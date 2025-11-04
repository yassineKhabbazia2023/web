import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { ExplorerDocument } from '../../DocumentsTypes'

export interface DocumentUploadProps {
  folder: Folder
  isUploadModalOpened: boolean
  currentServiceFolder: Folder[]
  currentService: Service['ServiceId']
  currentServiceName: Service['ServiceName']
  currentEntity: string
  files: File[]
  accountId: number
}

export interface ExplorerUploadDocument extends ExplorerDocument {
  file: File
}
