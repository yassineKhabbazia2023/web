/* eslint-disable max-len */
import type { Folder } from '@ged/models/Folder'

export interface RenameFolderModalProps {
  isRenameFolderModalVisible: boolean
  modalTitle: string
  inputLabel: string
  inputPlaceHolder: string
  cancelBtnLabel: string
  confirmBtnabel: string
  isConfirmButtonLoading: boolean
  inputContentDefault: string
  parentFolder: Folder
}
