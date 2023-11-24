import { ExplorerUploadDocument } from '../components/DocumentsUpload/DocumentsUploadTypes'
import { GivenActionState } from '../DocumentsTypes'
import {
  getDocumentNameExtension,
  getDocumentNameWithoutExtension,
  isExtensionAuthorized
} from './filesExtensions'
import {
  validInputAlphanumericFrench,
  validInputMaxLength
} from '../../common/helpers/inputValidationHelper'
import { Document } from '@/models/Document'
import { ExplorerMoveDocument } from '../components/DocumentsMove/DocumentsMoveTypes'

export const mapExplorerDocumentFromFiles = (files: File[]): ExplorerUploadDocument[] => {
  const explorerDocuments: ExplorerUploadDocument[] = []
  if (files.length > 0 && files) {
    files.forEach((file) => {
      let state: GivenActionState = 'TO_DO'
      let code = ''
      const extension = getDocumentNameExtension(file?.name)
      const name = getDocumentNameWithoutExtension(file?.name)

      if (file?.size === 0) {
        state = 'ERROR'
        code = 'FileEmpty'
      } else if (!isExtensionAuthorized(extension)) {
        state = 'ERROR'
        code = 'UnauthorizedFileType'
      } else if (!validInputAlphanumericFrench(name)) {
        state = 'ERROR'
        code = 'UnauthorizedCharFileName'
      } else if (!validInputMaxLength(name)) {
        state = 'ERROR'
        code = 'FileNameLengthExceeded'
      }

      explorerDocuments.push({
        givenActionState: state,
        isSelected: true,
        content: { name: file.name },
        codeError: code,
        file
      })
    })
  }

  return explorerDocuments
}
export const mapExplorerDocumentFromDocuments = (documents: Document[]): ExplorerMoveDocument[] => {
  const explorerDocuments: ExplorerMoveDocument[] = []
  if (documents.length > 0 && documents) {
    documents.forEach((document) => {
      const canMoveDocument = document.permissions.includes('CAN_MOVE_DOCUMENT')
      const isCertified = document.properties.HasSubscribedToVault === 'Oui'
      let codeError = ''
      if (isCertified) {
        codeError = 'DocumentCertifiedError'
      } else if (!canMoveDocument) {
        codeError = 'PermissionInvalidError'
      } else {
        codeError = ''
      }
      const state: GivenActionState = canMoveDocument ? 'TO_DO' : 'ERROR'
      explorerDocuments.push({
        id: document.id,
        givenActionState: state,
        isSelected: true,
        content: { name: document.name },
        codeError
      })
    })
  }
  return explorerDocuments
}
