/* eslint-disable max-len */
/* eslint-disable vitest/no-hooks */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { ExplorerUploadDocument, DocumentUploadProps } from './DocumentsUploadTypes'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import DocumentModalExplorer from '@/modules/Documents/components/DocumentsExplorerModal'
import type { GivenActionAuthorization } from '@/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ButtonAction } from '@/modules/common/Types/ButtonAction'
import { uploadDocument } from '@/services/Documents'
import DocumentsUpload from '.'
import DocumentsModalActionsFooter from '../DocumentsExplorerModal/components/DocumentsModalActionsFooter'
import { PButton } from '@kpmg/styleguide'

const generateTestFiles = (
  numberOfFiles: number,
  state: 'VALID' | 'UNVALID',
): File[] => {
  const files: File[] = []
  const conditionedFileSize = state === 'VALID' ? 2 : 0
  const fileName = state === 'VALID' ? 'filename.txt' : 'filename.mykey'
  const type = state === 'VALID' ? 'text/plain' : 'mykeyetc'

  for (let i = 0; i < numberOfFiles; i++) {
    const blob = new Blob(['Hello'], { type: 'text/plain' })
    const fileContent = blob.slice(0, conditionedFileSize)
    const file = new File([fileContent], fileName, {
      type,
    })
    files.push(file)
  }
  return files
}
const unValidDestination: Folder = foldersData[0][0] // id: 135393636
const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const validFiles: File[] = generateTestFiles(3, 'VALID')
const secondValidDestination: Folder = foldersData[0][0].children[0].children[0] // id: 135393649

const currentServiceFolder: Folder[] = foldersData[0]
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'

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
const defaultProps: DocumentUploadProps = {
  folder: validDestination,
  isUploadModalOpened: false,
  currentServiceFolder,
  currentService: curentService,
  selectedEntity,
  files: validFiles,
}

type DocumentUploadSetup = {
  isDocumentExplorerModalOpened: boolean
  explorerDocuments: ExplorerUploadDocument[]
  numberOfSelectedDocuments: number
  isUploadAuthorized: GivenActionAuthorization
  modalActionsbuttons: ButtonAction[]
  currentExplorerFolder: Folder
}

export type DocumentsUploadWrapper = VueWrapper<
  ComponentPublicInstance<DocumentUploadProps, DocumentUploadSetup>
>

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn(),
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
  }),
}))

vi.mock('@/services/Documents', () => ({
  uploadDocument: vi.fn(() => {
    return uploadDocumentsResponse
  }),
}))

const mockToastPlugin = vi.fn()

vi.mock('vue-inject', () => ({
  provide: vi.fn(),
}))

const createWrapper = (
  props: DocumentUploadProps = defaultProps,
): DocumentsUploadWrapper => {
  return mount(DocumentsUpload, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  }) as unknown as DocumentsUploadWrapper
}

const pinia = createPinia()

describe('foldersMove', () => {
  const findDocumentsExplorerModal = (wrapper: DocumentsUploadWrapper) =>
    wrapper.findComponent(DocumentModalExplorer)

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

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)
      expect(documentExplorerModalWrapper.exists()).toBeTruthy()
    })

    it('should pass the correct title based on the selected folder', () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }
      const wrapper = createWrapper(updatedProps)
      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)
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
      async ({ folder, expectedResult }) => {
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

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

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

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      wrapper.vm.explorerDocuments.forEach(element => {
        element.givenActionState = 'DONE'
      })
      await nextTick()
      await documentExplorerModalWrapper.vm.$emit('close-modal')

      expect(wrapper.emitted('close-upload-documents-modal')).toHaveLength(1)
    })

    it('should set currentExplorerFolder on navigate-to-folder event', async () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit(
        'navigate-to-folder',
        secondValidDestination,
      )

      expect(wrapper.vm.currentExplorerFolder).toStrictEqual(
        secondValidDestination,
      )
    })

    it('should emit update-source-folders on update-source-folders event', async () => {
      const updatedProps = { ...defaultProps, isUploadModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit(
        'update-source-folders',
        secondValidDestination,
      )

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
      const documentsExporerModalWrapper = findDocumentsExplorerModal(wrapper)
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
                findDocumentsExplorerModal(wrapper)

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
                findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-add-document-action-click',
          )

          await nextTick()

          expect(wrapper.vm.explorerDocuments).toHaveLength(
            wrapper.vm.explorerDocuments.filter(d => d.givenActionState === 'DONE').length,
          )
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
                  findDocumentsExplorerModal(wrapper)

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
