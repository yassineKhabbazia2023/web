/* eslint-disable max-len */
import type { Folder } from '@/models/Folder'

export interface CreateFolderModalProps {
  isCreateFolderModalVisible: boolean
  modalTitle: string
  inputLabel: string
  inputPlaceHolder: string
  cancelBtnLabel: string
  confirmBtnabel: string
  isConfirmButtonLoading: boolean
  selectedFolder: Folder
  isCentered?: boolean
}
