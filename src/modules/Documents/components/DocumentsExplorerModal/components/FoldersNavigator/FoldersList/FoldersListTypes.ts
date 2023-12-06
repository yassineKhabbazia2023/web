import type { Folder } from '@/models/Folder'
import { Service } from '@/models/Service'
import { ExplorerFoldersListLineDisabledState } from '@/modules/Documents/DocumentsTypes'

export interface FoldersListProps {
  currentFolder: Folder
  currentServiceFolder: Folder[]
  ExplorerAuthorizedGivenAction: boolean
  currentService: Service['ServiceId']
  selectedEntity: string
  isCreateFolderModalVisible: boolean
  explorerUnauthorizedGivenActionMessage: string
  foldersListEmptyFolderLabel: string
  explorerFolderListLineDisabledState?: ExplorerFoldersListLineDisabledState
}
