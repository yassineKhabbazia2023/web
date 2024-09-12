import type { ExplorerMoveFolder, FoldersMoveProps } from '../FoldersMoveTypes'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { GivenActionAuthorization }
  from '@/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ButtonAction } from '@/modules/common/Types/ButtonAction'

const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const folderToMove: Folder = foldersData[0][0].children[0].children[0].children[0] // id : 11111111

const currentServiceFolder: Folder[] = foldersData[0]
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'

export const defaultProps: FoldersMoveProps = {
  folder: validDestination,
  isMoveModalOpened: false,
  currentServiceFolder,
  currentService: curentService,
  selectedEntity,
  folderToMove,
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
