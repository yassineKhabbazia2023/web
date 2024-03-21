import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { ExplorerDocument, ExplorerFoldersListLineDisabledState } from '../../DocumentsTypes'
import type { ButtonAction } from '@/modules/common/Types/ButtonAction'

export interface GivenActionAuthorization{
    actionName: string
    isActionAuthorized: boolean
}

export interface DocumentsModalExplorerProps {
  modelValue: boolean
  currentFolder: Folder
  currentServiceFolder: Folder[]
  documents: ExplorerDocument[]
  ExplorerAuthorizedGivenAction: GivenActionAuthorization
  currentService: Service['ServiceId']
  selectedEntity: string
  explorerUnauthorizedGivenActionMessage: string
  foldersListEmptyFolderLabel: string
  documentsSelectorEmptyDocumentsListLabel: string
  modalActionsButtonsList: ButtonAction[]
  headerTitle: string
  modalTitle: string
  isFolderLineDisabled?: boolean
  explorerFolderListLineDisabledState?: ExplorerFoldersListLineDisabledState
  isFolderLine?: boolean
  canCloseModal:boolean
}
