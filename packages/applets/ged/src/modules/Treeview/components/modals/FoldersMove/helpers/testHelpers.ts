import type { Folder } from '@ged/models/Folder'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { validDestination, currentServiceFolder, currentService, folderToMove, selectedEntity, accountId } from '@ged/__mocks__/files.mocks'
import type { GivenActionAuthorization }
  from '@ged/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ExplorerMoveFolder, FoldersMoveProps } from '../FoldersMoveTypes'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'

export const defaultProps: FoldersMoveProps = {
  folder: validDestination,
  isMoveModalOpened: false,
  currentServiceFolder,
  currentService: currentService,
  selectedEntity,
  folderToMove,
  accountId,
}

export type FoldersMoveSetup = {
  isDocumentExplorerModalOpened: boolean
  explorerDocuments: ExplorerMoveFolder[]
  numberOfSelectedFolders: number
  isMoveAuthorized: GivenActionAuthorization
  modalActionsButtons: ButtonAction[]
  currentExplorerFolder: Folder
}

export type FoldersMoveWrapper = VueWrapper<
  ComponentPublicInstance<FoldersMoveProps, FoldersMoveSetup>
>
