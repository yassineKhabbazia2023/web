import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'

export interface DownloadFolderComposableProps {
  selectedFolderName: Folder['name'],
  selectedFolderId: Folder['id']
  currentService: Service['ServiceId']
  selectedEntity: string,
}
