import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'

export interface RenameFolderSectionProps {
  serviceId: Service['ServiceId']
  entityId: string
  accountId: number
  folderName: string
  folderId: Folder['id']
  parentFolder: Folder
  isRenameFolderModalVisible: boolean
}
