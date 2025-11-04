import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'

export interface DownloadFolderComposableProps {
  selectedFolderName: Folder['name']
  selectedFolderId: Folder['id']
  currentService: Service['ServiceId']
  currentEntity: string
  accountId: number
}
