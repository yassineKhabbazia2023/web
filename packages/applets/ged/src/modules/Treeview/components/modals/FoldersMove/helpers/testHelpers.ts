import type { ExplorerMoveFolder, FoldersMoveProps } from '../FoldersMoveTypes'
import { foldersData } from '@ged/modules/Treeview/mocks/treeFoldersMock'
import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { GivenActionAuthorization }
  from '@ged/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'

const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const folderToMove: Folder = foldersData[0][0].children[0].children[0].children[0] // id : 11111111

const currentServiceFolder: Folder[] = foldersData[0]
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'
const accountId = 1234

export const defaultProps: FoldersMoveProps = {
  folder: validDestination,
  isMoveModalOpened: false,
  currentServiceFolder,
  currentService: curentService,
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
