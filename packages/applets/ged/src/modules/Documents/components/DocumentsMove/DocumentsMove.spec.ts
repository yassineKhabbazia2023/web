import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { documentsMock, documentsMockWithOneCertified } from '@ged/__mocks__/documents.mocks'
import { documentsServiceMock } from '@ged/__mocks__/documents.service.mocks'
import { validDestination, currentServiceFolder, unValidDestination, secondValidDestination, currentService, selectedEntity, accountId } from '@ged/__mocks__/files.mocks'
import { findComponentByNameInWrapper } from '@ged/__mocks__/component.wrapper'
import type { Folder } from '@ged/models/Folder'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { GivenActionAuthorization } from '@ged/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'
import type { DocumentMoveProps, ExplorerMoveDocument } from './DocumentsMoveTypes'
import { moveDocuments } from '@ged/services/Documents'

import DocumentsMove from '.'

const defaultProps: DocumentMoveProps = {
  folder: validDestination,
  isMoveModalOpened: false,
  currentServiceFolder,
  currentService: currentService,
  selectedEntity,
  selectedDocuments: documentsMock,
  accountId,
}

type DocumentMoveSetup = {
  isDocumentExplorerModalOpened: boolean
  explorerDocuments: ExplorerMoveDocument[]
  numberOfSelectedDocuments: number
  isMoveAuthorized: GivenActionAuthorization
  modalActionsbuttons: ButtonAction[]
  currentExplorerFolder: Folder
}

export type DocumentsMoveWrapper = VueWrapper<
  ComponentPublicInstance<DocumentMoveProps, DocumentMoveSetup>
>

vi.mock('@pulse/styleguide')

vi.mock('@ged/services/Documents', () => documentsServiceMock)

const createWrapper = (
  props: DocumentMoveProps = defaultProps,
): DocumentsMoveWrapper => {
  return mount(DocumentsMove, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as DocumentsMoveWrapper
}

const pinia = createPinia()

describe('documents Move', () => {
  const findModalFooter = (wrapper: any) => wrapper.findComponent({ name: 'DocumentsModalActionsFooter' })

  const findConfirmButton = (wrapper: DocumentsMoveWrapper) => wrapper.findAllComponents({ name: 'PButton' })[1]

  beforeEach(() => {
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  describe('props', () => {
    it('should open and close modal based on isMoveModalOpened', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      expect(documentExplorerModalWrapper.exists()).toBeTruthy()
    })

    it('should pass the correct title based on the selected folder', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)
      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      expect(documentExplorerModalWrapper.props('modalTitle')).toBe(
        `Déplacer ${defaultProps.selectedDocuments.length} documents dans ${validDestination.name}`,
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
          isMoveModalOpened: true,
          folder,
        }

        const wrapper = createWrapper(updatedProps)
        expect(wrapper.vm.isMoveAuthorized.isActionAuthorized).toStrictEqual(
          expectedResult,
        )
      },
    )

    it('should mapExplorerDocumentFromFiles when provided document are changed', async () => {
      const updatedProps = { ...defaultProps, selectedDocuments: [] }
      const wrapper = createWrapper(updatedProps)

      await nextTick()

      expect(wrapper.vm.explorerDocuments).toHaveLength(0)
      vi.advanceTimersByTime(100)

      wrapper.setProps({
        selectedDocuments: documentsMock,
        isMoveModalOpened: true,
      })

      await nextTick()
      expect(wrapper.vm.explorerDocuments).toHaveLength(documentsMock.length)
      expect(wrapper.vm.explorerDocuments[0].givenActionState).toBe('TO_DO')
    })
  })

  describe('interactions', () => {
    it('should prevent closing modal when there is an operation in progress', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      wrapper.vm.explorerDocuments[0].givenActionState = 'FAILED'
      await nextTick()

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      await documentExplorerModalWrapper.vm.$emit(
        'modal-action-clicked',
      )

      await nextTick()

      expect(wrapper.emitted('close-move-documents-modal')).toBeFalsy()
    })

    it('should emit close-move-documents-modal on close modal event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      wrapper.vm.explorerDocuments.forEach(element => {
        element.givenActionState = 'DONE'
      })
      await nextTick()
      await documentExplorerModalWrapper.vm.$emit('close-modal')
      await nextTick()

      expect(wrapper.emitted('close-move-documents-modal')).toHaveLength(1)
    })

    it('should set currentExplorerFolder on navigate-to-folder event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

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
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

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
      const updatedProps = { ...defaultProps, selectedDocuments: [] }
      const wrapper = createWrapper(updatedProps)
      wrapper.setProps({ isMoveModalOpened: true })
      await nextTick()
      const documentsExporerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      const footerWrapper = findModalFooter(documentsExporerModalWrapper)

      const confirmBtn = findConfirmButton(footerWrapper)
      expect(confirmBtn.props('pDisabled')).toBeTruthy()
    })

    describe('move', () => {
      describe('confirm', () => {
        it('should call moveDocuments  on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-document-action-click',
          )

          await nextTick()

          expect(vi.mocked(moveDocuments)).toHaveBeenCalledTimes(1)
        })

        it('should update explorerDocuments to DONE on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-document-action-click',
          )

          await nextTick()

          expect(wrapper.vm.explorerDocuments).toHaveLength(
            wrapper.vm.explorerDocuments.filter(d => d.givenActionState === 'DONE').length,
          )
        })

        it('should update explorerDocuments to DONE except the one in ERROR state on modal-action-clicked event', async () => {
          const updatedProps = {
            ...defaultProps,
            isMoveModalOpened: true,
            selectedDocuments: documentsMockWithOneCertified,
          }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-document-action-click',
          )

          await nextTick()
          await flushPromises()
          const validDocument = documentsMockWithOneCertified[0]
          const expectedDocumentRequest = {
            // only the first document that is available for move should be moved
            ids: [validDocument.id],
            sourceFolderId: validDocument.folder.id,
            destinationFolderId: validDocument.folder.id,
            moveAll: false,
            serviceId: selectedEntity,
          }
          expect(moveDocuments).toHaveBeenCalledWith(currentService, selectedEntity, expectedDocumentRequest, accountId)

        })
      })

      describe('cancel', () => {
        it('should close modal on cancel click', async () => {
          const updatedProps = {
            ...defaultProps,
            isMoveModalOpened: true,
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

          expect(wrapper.emitted('close-move-documents-modal')).toBeTruthy()
        })
      })
    })
  })
})
