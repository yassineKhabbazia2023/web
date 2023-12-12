/* eslint-disable max-len */
/* eslint-disable vitest/no-hooks */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ExplorerUploadDocument, DocumentUploadProps } from './DocumentsUploadTypes'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import { Folder } from '@/models/Folder'
import { Service } from '@/models/Service'
import { VueWrapper, mount } from '@vue/test-utils'
import { ComponentPublicInstance, nextTick } from 'vue'
import DocumentModalExplorer from '@/modules/Documents/components/DocumentsExplorerModal'
import { GivenActionAuthorization } from '@/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import { ButtonAction } from '@/modules/common/Types/ButtonAction'
import DocumentsUpload from '.'

const generateTestFiles = (
  numberOfFiles: number,
  state: 'VALID' | 'UNVALID'
): File[] => {
  const files: File[] = []
  const conditionedFileSize = state === 'VALID' ? 2 : 0
  const fileName = state === 'VALID' ? 'filename.txt' : 'filename.mykey'
  const type = state === 'VALID' ? 'text/plain' : 'mykeyetc'

  for (let i = 0; i < numberOfFiles; i++) {
    const blob = new Blob(['Hello'], { type: 'text/plain' })
    const fileContent = blob.slice(0, conditionedFileSize)
    const file = new File([fileContent], fileName, {
      type
    })
    files.push(file)
  }
  return files
}
const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const validFiles: File[] = generateTestFiles(3, 'VALID')

const currentServiceFolder: Folder[] = foldersData[0]
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'

const defaultProps: DocumentUploadProps = {
  folder: validDestination,
  isUploadModalOpened: false,
  currentServiceFolder,
  currentService: curentService,
  selectedEntity,
  files: validFiles
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
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))

vi.mock('@/services/Documents', () => ({
  uploadDocument: vi.fn(() => {
    throw new Error('something uncool')
  })
}))

const mockToastPlugin = vi.fn()

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

const createWrapper = (
  props: DocumentUploadProps = defaultProps
): DocumentsUploadWrapper => {
  return mount(DocumentsUpload, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      }
    }
  }) as unknown as DocumentsUploadWrapper
}

const pinia = createPinia()

describe('foldersMove', () => {
  const findDocumentsExplorerModal = (wrapper: DocumentsUploadWrapper) =>
    wrapper.findComponent(DocumentModalExplorer)

  beforeEach(() => {
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  describe('interactions', () => {

    describe('upload', () => {
      describe('confirm', () => {

        it('should update explorerDocuments to ERROR on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isUploadModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-add-document-action-click'
          )

          await nextTick()

          expect(wrapper.vm.explorerDocuments).toHaveLength(
            wrapper.vm.explorerDocuments.filter(
              (d) => d.givenActionState === 'ERROR'
            ).length
          )
        })

      })

    })
  })
})
