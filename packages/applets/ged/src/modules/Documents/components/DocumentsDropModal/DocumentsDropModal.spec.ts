import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DocumentsDropModal from '.'
import type { DocumentsDropModalProps } from './DocumentsDropModalTypes'
import { type ComponentPublicInstance } from 'vue'

const folderName = 'Something'
const defaultProps: DocumentsDropModalProps = {
  isVisible: false,
  targetFolderName: folderName,
  numberOfUploadedFiles: 1,
}

export type DocumentsDropModalWrapper = VueWrapper<
  ComponentPublicInstance<DocumentsDropModalProps>
>
const createWrapper = (props: DocumentsDropModalProps = defaultProps):
DocumentsDropModalWrapper => {
  return mount(DocumentsDropModal, {
    props,
  })
}

// component finders
const findDocumentsDropModal = (wrapper: DocumentsDropModalWrapper) =>
  wrapper.findComponent({ name: 'ConfirmationPopup' })

const wrapper = createWrapper()

describe('documents drop modal', () => {
  describe('props', () => {
    it('should display the correct folder name', () => {
      const confirmationPopupWrapper = findDocumentsDropModal(wrapper)
      expect(confirmationPopupWrapper.props('message')).toBe(
        `Document is being uploaded to the "${folderName}" folder`,
      )
    })

    it('should display the correct title', () => {
      const confirmationPopupWrapper = findDocumentsDropModal(wrapper)
      expect(confirmationPopupWrapper.props('title')).toBe(
        'One moment...',
      )
    })
  })
})
