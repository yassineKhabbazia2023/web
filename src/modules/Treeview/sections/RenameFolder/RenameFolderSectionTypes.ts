import type { Folder } from '@/models/Folder'

export interface RenameFolderSectionProps {
  serviceId: string
  entityId: string
  folderName: string
  folderId: number
  parentFolder: Folder
  isRenameFolderModalVisible: boolean
}
