import { describe, it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { DocumentsDropConfirmationPopupProps } from './DocumentsDropConfirmationPopupTypes'
import { nextTick, type ComponentPublicInstance } from 'vue'

import DocumentsDropConfirmationPopup from './DocumentsDropConfirmationPopup.vue'

const defaultProps: DocumentsDropConfirmationPopupProps = {
  modelValue: false,
  numberOfDocumentsToDrop: 1,
  destinationPath: 'folder/path1',
  isDocumentDropConfirmButtonLoading: false,
}

export type DocumentsDropConfirmationPopupWrapper = VueWrapper<
  ComponentPublicInstance<DocumentsDropConfirmationPopupProps>
>
const createWrapper = (props: DocumentsDropConfirmationPopupProps = defaultProps)
:DocumentsDropConfirmationPopupWrapper => {
  return mount(DocumentsDropConfirmationPopup, {
    props,
  }) as unknown as DocumentsDropConfirmationPopupWrapper
}

// component finders
const findConfirmationPopup = (wrapper:DocumentsDropConfirmationPopupWrapper) =>
  wrapper.findComponent({ name: 'ConfirmationPopup' })

let wrapper = createWrapper()

describe('documentList', () => {
  describe('props', () => {
    it('should display the corrrect messsage on the cancel button', () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }
      wrapper = createWrapper(updatedProps)

      const confirmationPopupWrapper = findConfirmationPopup(wrapper)
      expect(confirmationPopupWrapper.props('cancelButtonContent')).toBe(
        'Cancel',
      )
    },
    )
  })

  describe('interactions', () => {
    it('should emit confirm-documents-drop upon on-confirm-button-click event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }
      wrapper = createWrapper(updatedProps)

      const confirmationPopupWrapper = findConfirmationPopup(wrapper)
      await confirmationPopupWrapper.vm.$emit('on-confirm-button-click')
      await nextTick()

      expect(wrapper.emitted('confirm-documents-drop')).toHaveLength(1)
    })
  })
})
