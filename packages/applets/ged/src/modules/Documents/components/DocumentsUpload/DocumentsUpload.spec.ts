
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DocumentUploadProps } from './DocumentsUploadTypes'
import { foldersData } from '@ged/modules/Treeview/mocks/treeFoldersMock'
import type { Folder } from '@ged/models/Folder'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import { uploadDocument } from '@ged/services/Documents'
import DocumentsUpload from '.'
import DocumentsModalActionsFooter from '../DocumentsExplorerModal/components/DocumentsModalActionsFooter'
import { PButton } from '@pulse/styleguide/components'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import { generateTestFiles, defaultProps, type DocumentUploadSetup } from '../../helpers/testHelpers'
import { findComponentByNameInWrapper } from '@ged/modules/Documents/helpers/testHelpers'

const unValidDestination: Folder = foldersData[0][0] // id: 135393636
const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const validFiles: File[] = generateTestFiles(3, 'VALID')
const secondValidDestination: Folder = foldersData[0][0].children[0].children[0] // id: 135393649

const uploadDocumentsResponse = {
  id: '10274210-f1e6-4e3c-8965-0e2f5f33e1eb',
  name: 'Final (3) (12).jpg',
  content: {
    href: '12',
  },
  preview: {
    href: '12',
  },
  updatedBy: 'obenamor@kpmg.fr',
  updated: '2023-12-12T09:08:45.148+00:00',
  type: '.jpg',
  size: 27819,
  comments: null,
  isUploadedInGedLoop: null,
  folder: {
    id: 135393637,
    path: ['Comptabilité', 'Dépôt'],
  },
  created: '2023-12-12T09:08:45.147+00:00',
  createdBy: 'obenamor@kpmg.fr',
  account: {
    id: '93012cc8-77b9-4161-8dbd-61915d935e21',
    name: 'JEAN LÉVAGE',
  },
  properties: {},
  lifecycleStatus: '1',
  paymentStatus: null,
  source: {
    id: 0,
    code: 'User',
    libelle: 'Web',
  },
  piaStatus: null,
  permissions: [
    'CAN_RENAME_DOCUMENT',
    'CAN_DELETE_DOCUMENT',
    'CAN_TRANSMIT_DOCUMENT',
    'CAN_REPLACE_DOCUMENT',
    'CAN_MOVE_DOCUMENT',
    'CAN_RESTORE_DOCUMENT',
  ],
  isNew: null,
}

export type DocumentsUploadWrapper = VueWrapper<
  ComponentPublicInstance<DocumentUploadProps, DocumentUploadSetup>
>

vi.mock('@ged/services/Documents', () => ({
  uploadDocument: vi.fn(() => {
    return uploadDocumentsResponse
  }),
}))

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
  const findModalFooter = (wrapper: any) =>
    wrapper.findComponent(DocumentsModalActionsFooter)

  const findConfirmButton = (wrapper: DocumentsUploadWrapper) =>
    wrapper.findAllComponents(PButton)[1]

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
      const documentsExporerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      const footerWrapper = findModalFooter(documentsExporerModalWrapper)

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
