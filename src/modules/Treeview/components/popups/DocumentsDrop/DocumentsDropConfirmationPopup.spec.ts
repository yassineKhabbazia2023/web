import { describe, it, expect } from 'vitest'
import DocumentsDropConfirmationPopup from './DocumentsDropConfirmationPopup.vue'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { DocumentsDropConfirmationPopupProps } from './DocumentsDropConfirmationPopupTypes'
import { nextTick, type ComponentPublicInstance } from 'vue'
import ConfirmationPopup from '@/modules/common/templates/popups'

const defaultProps: DocumentsDropConfirmationPopupProps = {
  isVisible: false,
  numberOfDocumentsToDrop: 1,
  destinationPath: 'folder/path1',
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
  wrapper.findComponent(ConfirmationPopup)

let wrapper = createWrapper()

describe('documentList', () => {
  describe('props', () => {
    const titleCaseParams = [
      {
        numberOfDocumentsToDrop: 1,
        expectedResult: 'Déplacer ce document ?',
      },
      {
        numberOfDocumentsToDrop: 1,
        expectedResult: 'Déplacer ces documents ?',
      },
    ]

    it.each(titleCaseParams)(
      'should display the corrrect messsage on the cancel button',
      ({ numberOfDocumentsToDrop, expectedResult }) => {
        const updatedProps = {
          ...defaultProps,
          isVisible: true,
          numberOfDocumentsToDrop,
        }
        wrapper = createWrapper(updatedProps)

        const confirmationPopupWrapper = findConfirmationPopup(wrapper)
        expect(confirmationPopupWrapper.props('cancelButtonContent')).toBe(
          expectedResult,
        )
      },
    )

    const messageCaseParams = [
      {
        numberOfDocumentsToDrop: 1,
        expectedResult:
        `Si vous cliquez sur "Confirmer", le document sera déplacé dans le dossier ${defaultProps.destinationPath}`,
      },
      {
        numberOfDocumentsToDrop: 1,
        expectedResult:
        // eslint-disable-next-line max-len
        `Si vous cliquez sur "Confirmer", les documents seront déplacés dans le dossier ${defaultProps.destinationPath}`,
      },
    ]

    it.each(messageCaseParams)(
      'should display the corrrect popup message',
      ({ numberOfDocumentsToDrop, expectedResult }) => {
        const updatedProps = {
          ...defaultProps,
          isVisible: true,
          numberOfDocumentsToDrop,
        }
        wrapper = createWrapper(updatedProps)

        const confirmationPopupWrapper = findConfirmationPopup(wrapper)
        expect(confirmationPopupWrapper.props('cancelButtonContent')).toBe(
          expectedResult,
        )
      },
    )
  })

  describe('interactions', () => {
    it('should close modal when isVisible is changed', async () => {
      const updatedProps = {
        ...defaultProps,
        isVisible: true,
      }
      wrapper = createWrapper(updatedProps)

      wrapper.setProps({ isVisible: false })
      await nextTick()

      expect(wrapper.emitted('update:isVisible')).toHaveLength(1)
      expect(wrapper.emitted('update:isVisible')).toStrictEqual([['false']])
    })

    it('should emit confirm-documents-drop upon on-confirm-button-click event', async () => {
      const updatedProps = {
        ...defaultProps,
        isVisible: true,
      }
      wrapper = createWrapper(updatedProps)

      const confirmationPopupWrapper = findConfirmationPopup(wrapper)
      await confirmationPopupWrapper.vm.$emit('on-confirm-button-click')
      await nextTick()

      expect(wrapper.emitted('confirm-documents-drop')).toHaveLength(1)
    })

    it('should emit cancel-documents-drop upon on-cancel-button-click event', async () => {
      const updatedProps = {
        ...defaultProps,
        isVisible: true,
      }
      wrapper = createWrapper(updatedProps)

      const confirmationPopupWrapper = findConfirmationPopup(wrapper)
      await confirmationPopupWrapper.vm.$emit('on-cancel-button-click')
      await nextTick()

      expect(wrapper.emitted('cancel-documents-drop')).toHaveLength(1)
    })

    it('should emit  on-close-popup upon on-close-popup event', async () => {
      const updatedProps = {
        ...defaultProps,
        isVisible: true,
      }
      wrapper = createWrapper(updatedProps)

      const confirmationPopupWrapper = findConfirmationPopup(wrapper)
      await confirmationPopupWrapper.vm.$emit('on-close-popup')
      await nextTick()

      expect(wrapper.emitted('close-popup')).toHaveLength(1)
    })
  })
})
