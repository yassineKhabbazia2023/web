import type { Folder } from '@/models/Folder'
import { Service } from '@/models/Service'

export interface FolderListProps {
  currentFolder: Folder
  currentServiceFolder: Folder[]
  ExplorerAuthorizedGivenAction: boolean
  currentService: Service['ServiceId']
  selectedEntity: string
  isCreateFolderModalVisible: boolean
  explorerUnauthorizedGivenActionMessage:string
  foldersListEmptyFolderLabel:string
}
