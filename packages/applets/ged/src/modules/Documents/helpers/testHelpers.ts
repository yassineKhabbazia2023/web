import { validDestination, validFiles, currentServiceFolder, currentService, currentServiceName, selectedEntity, accountId } from '@ged/__mocks__/files.mocks'
import type { Folder } from '@ged/models/Folder'
import type { GivenActionAuthorization }
  from '@ged/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'
import type { ExplorerUploadDocument, DocumentUploadProps } from '../components/DocumentsUpload/DocumentsUploadTypes'

export const defaultProps: DocumentUploadProps = {
  folder: validDestination,
  isUploadModalOpened: false,
  currentServiceFolder,
  currentServiceName,
  currentService: currentService,
  selectedEntity,
  files: validFiles,
  accountId,
}

export type DocumentUploadSetup = {
  isDocumentExplorerModalOpened: boolean
  explorerDocuments: ExplorerUploadDocument[]
  numberOfSelectedDocuments: number
  isUploadAuthorized: GivenActionAuthorization
  modalActionsbuttons: ButtonAction[]
  currentExplorerFolder: Folder
}
