import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { ExplorerDocument, ExplorerFoldersListLineDisabledState } from '../../DocumentsTypes'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'

export interface GivenActionAuthorization {
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
  accountId: number
  explorerUnauthorizedGivenActionMessage: string
  foldersListEmptyFolderLabel: string
  documentsSelectorEmptyDocumentsListLabel: string
  modalActionsButtonsList: ButtonAction[]
  headerTitle: string
  modalTitle: string
  isFolderLineDisabled?: boolean
  explorerFolderListLineDisabledState?: ExplorerFoldersListLineDisabledState
  isFolderLine?: boolean
  canCloseModal: boolean
}
