import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { ExplorerFoldersListLineDisabledState } from '@/modules/Documents/DocumentsTypes'

export interface FoldersListProps {
  currentFolder: Folder
  currentServiceFolder: Folder[]
  explorerAuthorizedGivenAction: boolean
  currentService: Service['ServiceId']
  selectedEntity: string
  isCreateFolderModalVisible: boolean
  explorerUnauthorizedGivenActionMessage: string
  foldersListEmptyFolderLabel: string
  explorerFolderListLineDisabledState?: ExplorerFoldersListLineDisabledState
}
