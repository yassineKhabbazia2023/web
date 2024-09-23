import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { ExplorerFoldersListLineDisabledState } from '@ged/modules/Documents/DocumentsTypes'

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
