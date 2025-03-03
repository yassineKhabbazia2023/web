
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DocumentUploadProps } from './DocumentsUploadTypes'
import { generateTestFiles, secondValidDestination, unValidDestination, validDestination, validFiles } from '@ged/__mocks__/files.mocks'
import { documentsServiceMock } from '@ged/__mocks__/documents.service.mocks'
import { findComponentByNameInWrapper } from '@ged/__mocks__/component.wrapper'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import { uploadDocument } from '@ged/services/Documents'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import { defaultProps, type DocumentUploadSetup } from '../../helpers/testHelpers'

import DocumentsUpload from './DocumentsUpload.vue'

export type DocumentsUploadWrapper = VueWrapper<
  ComponentPublicInstance<DocumentUploadProps, DocumentUploadSetup>
>

vi.mock('@ged/services/Documents', () => documentsServiceMock)

vi.mock('@pulse/styleguide')

const createWrapper = (
  props: DocumentUploadProps = defaultProps,
): DocumentsUploadWrapper => {
  return mount(DocumentsUpload, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as DocumentsUploadWrapper
}

const pinia = createPinia()

describe('test DocumentsUpload', () => {
  const findModalFooter = (wrapper: any) => wrapper.findComponent({ name: 'DocumentsModalActionsFooter' })

  const findConfirmButton = (wrapper: DocumentsUploadWrapper) => wrapper.findAllComponents({ name: 'PButton' })[1]

  beforeEach(() => {
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  describe('props', () => {
    it('should open and close modal based on isUploadModalOpened', () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      expect(documentExplorerModalWrapper.exists()).toBeTruthy()
    })

    it('should pass the correct title based on the selected folder', () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }
      const wrapper = createWrapper(updatedProps)
      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      expect(documentExplorerModalWrapper.props('modalTitle')).toBe(
        `Déposer ${defaultProps.files.length} documents dans ${validDestination.name}`,
      )
    })

    const cases = [
      {
        folder: validDestination,
        expectedResult: true,
      },
      {
        folder: unValidDestination,
        expectedResult: false,
      },
    ]

    it.each(cases)(
      'should calculate the ExplorerAuthorizedGivenAction correctly with "%s"',
      ({ folder, expectedResult }) => {
        const updatedProps = {
          ...defaultProps,
          isUploadModalOpened: true,
          folder,
        }

        const wrapper = createWrapper(updatedProps)
        expect(wrapper.vm.isUploadAuthorized.isActionAuthorized).toStrictEqual(
          expectedResult,
        )
      },
    )

    it('should mapExplorerDocumentFromFiles when provided files are changed', async () => {
      const updatedProps = { ...defaultProps, files: [] }
      const wrapper = createWrapper(updatedProps)

      await nextTick()

      expect(wrapper.vm.explorerDocuments).toHaveLength(0)
      vi.advanceTimersByTime(100)

      wrapper.setProps({
        files: generateTestFiles(2, 'VALID'),
        isUploadModalOpened: true,
      })

      await nextTick()
      expect(wrapper.vm.explorerDocuments).toHaveLength(2)
    })
  })

  describe('interactions', () => {
    it('should prevent closing modal when there is an operation in progress', async () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      wrapper.vm.explorerDocuments[0].givenActionState = 'FAILED'
      await nextTick()

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      await documentExplorerModalWrapper.vm.$emit(
        'modal-action-clicked',
        'modal-move-folder-action-click',
      )

      await nextTick()

      expect(wrapper.emitted('close-upload-documents-modal')).toBeFalsy()
    })

    it('should emit close-upload-documents-modal on close modal event', async () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      wrapper.vm.explorerDocuments.forEach(element => {
        element.givenActionState = 'DONE'
      })
      await nextTick()
      await documentExplorerModalWrapper.vm.$emit('close-modal')
      await nextTick()

      expect(wrapper.emitted('close-upload-documents-modal')).toHaveLength(1)
    })

    it('should set currentExplorerFolder on navigate-to-folder event', async () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      await documentExplorerModalWrapper.vm.$emit(
        'navigate-to-folder',
        secondValidDestination,
      )
      await nextTick()

      expect(wrapper.vm.currentExplorerFolder).toStrictEqual(
        secondValidDestination,
      )
    })

    it('should emit update-source-folders on update-source-folders event', async () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      await documentExplorerModalWrapper.vm.$emit(
        'update-source-folders',
        secondValidDestination,
      )
      await nextTick()

      expect(wrapper.emitted('update-source-folders')).toHaveLength(1)
      expect(wrapper.emitted('update-source-folders')).toStrictEqual([
        [secondValidDestination],
      ])
    })

    it('should disable confirm button if there is 0 documents with the todo state', async () => {
      const updatedProps = { ...defaultProps, files: generateTestFiles(1, 'UNVALID') }
      const wrapper = createWrapper(updatedProps)
      wrapper.setProps({ isUploadModalOpened: true })
      await nextTick()
      const documentsExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      const footerWrapper = findModalFooter(documentsExplorerModalWrapper)

      const confirmBtn = findConfirmButton(footerWrapper)

      expect(confirmBtn.props('pDisabled')).toBeTruthy()
    })

    describe('upload', () => {
      describe('confirm', () => {
        it('should call uploadDocument  on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isUploadModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-add-document-action-click',
          )

          await nextTick()

          expect(vi.mocked(uploadDocument)).toHaveBeenCalledTimes(validFiles.length)
        })

        it('should update explorerDocuments to DONE on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isUploadModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-add-document-action-click',
          )

          await nextTick()

          expect(wrapper.vm.explorerDocuments).toHaveLength(
            wrapper.vm.explorerDocuments.filter(d => d.givenActionState === 'DONE').length,
          )
        })

        it('should display error toaster when upload document fails', async () => {
          const updatedProps = { ...defaultProps, isUploadModalOpened: true }

          vi.mocked(uploadDocument).mockRejectedValue(new Error('Upload failed'))

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-add-document-action-click',
          )

          await flushPromises()
          await nextTick()
          expect(PNotificationMock).toHaveBeenCalled()
        })
      })

      describe('cancel', () => {
        it('should close modal on cancel click', async () => {
          const updatedProps = {
            ...defaultProps,
            isUploadModalOpened: true,
          }
          const wrapper = createWrapper(updatedProps)

          wrapper.vm.explorerDocuments[0].givenActionState = 'FAILED'
          await nextTick()

          const documentExplorerModalWrapper =
                  findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-cancel-document-action-click',
          )

          await nextTick()

          expect(wrapper.emitted('close-upload-documents-modal')).toBeTruthy()
        })
      })
    })
  })
})
