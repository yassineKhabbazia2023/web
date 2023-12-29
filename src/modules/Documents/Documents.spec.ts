/* eslint-disable vitest/no-hooks */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { foldersData } from '../Treeview/mocks/treeFoldersMock'
import Documents from './Documents.vue'
import { createPinia, setActivePinia } from 'pinia'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import DocumentsList from './sections/DocumentsList'
import { DocumentsProps } from './DocumentsTypes'
import {
  downloadDocument,
  fetchFolderDocuments,
  downloadDocuments,
  transmitDocuments
} from '@/services/Documents'
import {
  documentsResponsePayload,
  documentsResponsePayloadMoreThanOneDoc
} from '@/modules/Documents/mocks/documentsWithTableStructureDataMock'
import { Document, DocumentsWithTableStructure, TableRowDocument } from '@/models/Document'
import { ComponentPublicInstance, nextTick } from 'vue'
import DocumentDeleteModal
  from '@/modules/Documents/components/DocumentDeleteModal'
import DocumentsActionsBar from '@/modules/Documents/sections/DocumentsActions'
import DocumentRename from './components/DocumentRename'
import DocumentUpload from '@/modules/Documents/components/DocumentsUpload'
import DocumentMove from './components/DocumentsMove'
import { Folder } from '@/models/Folder'
import { PBreadcrumb, PPagination } from '@kpmg/styleguide'
import DocumentPreview from './components/DocumentPreview'
import { documentMock } from './mocks/documentMock'

type DocumentsSetup = {
  documents: DocumentsWithTableStructure
  selectedDocument: Document
  selectedDocuments: Document[]
  isRenameModalOpened: boolean
  isPreviewDrawerOpened: boolean
}

export type DocumentsWrapper = VueWrapper<
  ComponentPublicInstance<DocumentsSetup, DocumentsProps>
>

const mockToastPlugin = vi.fn()

const pinia = createPinia()

const defaultProps = {
  currentService: foldersData[0][0].children[0].serviceId,
  selectedEntity: 'my-entity',
  selectedFolder: foldersData[0][0].children[0],
  currentServiceFolder: foldersData[0]
}

const createWrapper = (
  props: DocumentsProps = defaultProps
): DocumentsWrapper => {
  return mount(Documents, {
    props,
    global: {
      stubs: {
        PToolbox: {
          template: '<span />'
        },
        PButton: {
          template: '<div />'
        }
      },
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      }
    }
  }) as unknown as DocumentsWrapper
}

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

vi.mock('@/services/Documents', () => ({
  fetchFolderDocuments: vi.fn(),
  downloadDocuments: vi.fn(),
  downloadDocument: vi.fn(),
  transmitDocuments: vi.fn(),
  previewDocument: vi.fn(() => {
    return Promise.resolve({
      data: new ArrayBuffer(1),
      headers: { 'content-type': 'image/jpeg' }
    })
  })
}))

vi.mock('./helpers/downloadFilesHelper', () => ({
  downloadFile: vi.fn()
}))

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

const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637

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

describe('documents', () => {
  const findDcumentActionBar = (wrapper: DocumentsWrapper) =>
    wrapper.findComponent(DocumentsActionsBar)

  const findDocumentUpload = (wrapper: DocumentsWrapper) =>
    wrapper.findComponent(DocumentUpload)

  const findDocumentMove = (wrapper: DocumentsWrapper) =>
    wrapper.findComponent(DocumentMove)

  const findDocumentsList = (wrapper: DocumentsWrapper) =>
    wrapper.findComponent(DocumentsList)

  const findPBreadCrumb = (wrapper: DocumentsWrapper) => wrapper.findComponent(PBreadcrumb)

  const findPPagination = (wrapper: DocumentsWrapper) => wrapper.findComponent(PPagination)

  beforeEach(() => {

    setActivePinia(pinia)
    flushPromises()
    vi.useFakeTimers()
  })
  describe('events', () => {
    it('should set selected fikes on p-upload-files-selected', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentActionBarWrapper = findDcumentActionBar(wrapper)

      const files = generateTestFiles(2, 'VALID')
      await documentActionBarWrapper.vm.$emit('p-upload-files-selected', files)
      await nextTick()

      const documentsUploadWrapper = findDocumentUpload(wrapper)
      expect(documentsUploadWrapper.props('files')).toStrictEqual(files)

    })

    it('should propagate update-source-folders event from DocumentMove', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentMoveWrapper = findDocumentMove(wrapper)

      await documentMoveWrapper.vm.$emit(
        'update-source-folders',
        validDestination
      )
      await nextTick()

      expect(wrapper.emitted('update-source-folders')).toHaveLength(1)
      expect(wrapper.emitted('update-source-folders')).toStrictEqual([[validDestination]])
    })

    it('should open move modal oppon documentslist toolbox-action-triggered event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const documentsListWrapper = findDocumentsList(wrapper)
      await documentsListWrapper.vm.$emit('toolbox-action-triggered', 'move-document')
      await nextTick()

      const documentMoveWrapper = findDocumentMove(wrapper)

      expect(documentMoveWrapper.props('isMoveModalOpened')).toBeTruthy()
    })

    it('should close move modal oppon DocumentMove close-move-documents-modal event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentMoveWrapper = findDocumentMove(wrapper)
      await documentMoveWrapper.vm.$emit(
        'close-move-documents-modal'
      )
      await nextTick()

      expect(documentMoveWrapper.props('isMoveModalOpened')).toBeFalsy()
    })

    it('should close modal oppon DocumentUpload close-upload-documents-modal event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentUploadWrapper = findDocumentUpload(wrapper)
      await documentUploadWrapper.vm.$emit(
        'close-upload-documents-modal '
      )
      await nextTick()

      expect(documentUploadWrapper.props('isUploadModalOpened')).toBeFalsy()

    })

    it('should navigate to folder oppon PBreadcrumb p-breadcrumb-item-click event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const pbreadCrumbWrapper = findPBreadCrumb(wrapper)
      await pbreadCrumbWrapper.vm.$emit('p-breadcrumb-item-click', validDestination.id)

      expect(wrapper.emitted('change-selected-folder')).toHaveLength(1)
      expect(wrapper.emitted('change-selected-folder')).toStrictEqual([[validDestination]])
    })

    it('should call fetch documents when on-sort-change is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload

      await nextTick()
      const documents = wrapper.findComponent(DocumentsList)
      await nextTick()

      await documents.vm.$emit('on-sort-change', '+name')

      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        0,
        10,
        '+name'
      )
    })

    // an exceptional test to be able to cover the composable code cause of the
    // complexity of mocking i18n and the toastPlugin (not recommended)
    it('should call download document composable oppon  toolbox-action-triggered', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
          documentsResponsePayload.documentsPage.items
      await nextTick()

      const documentsList = wrapper.findComponent(DocumentsList)
      await nextTick()

      await documentsList.vm.$emit(
        'toolbox-action-triggered',
        'download-document'
      )

      expect(vi.mocked(downloadDocument)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        documentsResponsePayload.documentsPage.items[0].id
      )
    }
    )

    it('should use download as archive when number of ' +
    'selected documents is more than 1', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayloadMoreThanOneDoc
      componentInstance.selectedDocuments =
        documentsResponsePayloadMoreThanOneDoc.documentsPage.items

      await nextTick()

      const documentActionBar = wrapper.findComponent(DocumentsActionsBar)
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-download-action-click'
      )
      await nextTick()
      expect(vi.mocked(downloadDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        documentsResponsePayloadMoreThanOneDoc.documentsPage.items.map(
          (x) => x.id
        )
      )
    })

    it('should call fetch documents when document-rename is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.selectedDocuments = documentsResponsePayload.documentsPage.items
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const documentRename = wrapper.findComponent(DocumentRename)

      await nextTick()

      await documentRename.vm.$emit('document-rename')

      expect(documentRename.props('modelValue')).toBeFalsy()
    })

    it('should open delete modal when toolbox-action-triggered is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
              [documentsResponsePayload.documentsPage.items[0]]
      await nextTick()
      const documents = wrapper.findComponent(DocumentsList)
      await nextTick()

      await documents.vm.$emit('toolbox-action-triggered', 'delete-document')

      const deleteModal = wrapper.findComponent(DocumentDeleteModal)

      expect(deleteModal.props('isVisible')).toBeTruthy()
      expect(deleteModal.props('documentIds'))
        .toStrictEqual([documentsResponsePayload.documentsPage.items[0].id])
    })

    it('should call fetch documents when confirm-delete-document is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()
      const deleteModal = wrapper.findComponent(DocumentDeleteModal)
      await nextTick()

      await deleteModal.vm.$emit('confirm-delete-document')

      expect(deleteModal.props('isVisible')).toBeFalsy()
      expect(deleteModal.props('documentIds')).toStrictEqual([])
      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        0,
        10,
        '-created'
      )
    }, 30000)

    it('should close delete modal when cancel-delete-document is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()
      const deleteModal = wrapper.findComponent(DocumentDeleteModal)
      await nextTick()

      await deleteModal.vm.$emit('cancel-delete-document')

      expect(deleteModal.props('isVisible')).toBeFalsy()
    })
    // eslint-disable-next-line max-len
    it('should open delete modal  when click on action bar download button', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
              [documentsResponsePayload.documentsPage.items[0]]
      await nextTick()

      const documentActionBar = wrapper.findComponent(DocumentsActionsBar)
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-delete-action-click'
      )

      await nextTick()
      const deleteModal = wrapper.findComponent(DocumentDeleteModal)
      await nextTick()

      expect(deleteModal.props('isVisible')).toBeTruthy()
      expect(deleteModal.props('documentIds'))
        .toStrictEqual([documentsResponsePayload.documentsPage.items[0].id])
    })

    it('should open rename  modal  when click on action bar rename button', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
              [documentsResponsePayload.documentsPage.items[0]]
      await nextTick()

      const documentActionBar = wrapper.findComponent(DocumentsActionsBar)
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-rename-action-click'
      )

      await nextTick()
      const renameModal = wrapper.findComponent(DocumentRename)
      await nextTick()

      expect(renameModal.props('modelValue')).toBeTruthy()
    })

    // eslint-disable-next-line max-len
    it('should call transmit document composable oppon  toolbox-action-triggered', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
            documentsResponsePayload.documentsPage.items
      await nextTick()

      const documentsList = wrapper.findComponent(DocumentsList)
      await nextTick()

      await documentsList.vm.$emit(
        'toolbox-action-triggered',
        'transmit-document'
      )

      expect(vi.mocked(transmitDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        [documentsResponsePayload.documentsPage.items[0].id]
      )
    })

    // eslint-disable-next-line max-len
    it('should not call transmit document composable oppon  toolbox-action-triggered whe no selected documents', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload

      await nextTick()

      const documentsList = wrapper.findComponent(DocumentsList)
      await nextTick()

      await documentsList.vm.$emit(
        'toolbox-action-triggered',
        'transmit-document'
      )

      expect(vi.mocked(transmitDocuments)).toHaveBeenCalledTimes(0)
    })
    // eslint-disable-next-line max-len
    it('should call transmit document composable oppon click on action bar transmit button', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments = [
        documentsResponsePayload.documentsPage.items[0]
      ]
      await nextTick()

      const documentActionBar = wrapper.findComponent(DocumentsActionsBar)
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-transmit-action-click'
      )

      await nextTick()
      expect(vi.mocked(transmitDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        [documentsResponsePayload.documentsPage.items[0].id]
      )
    })

    it('should call fetch documents oppon transmit documents event', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments = [
        documentsResponsePayload.documentsPage.items[0]
      ]
      await nextTick()

      const documentActionBar = wrapper.findComponent(DocumentsActionsBar)
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-transmit-action-click'
      )
      await nextTick()

      vi.advanceTimersByTime(300)
      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedFolder.id,
        'my-entity',
        0,
        10,
        '-created'
      )
    })

    it('should call fetch documents oppon transmit documents event triggered from toolbox',
      async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload
        componentInstance.selectedDocuments =
        documentsResponsePayload.documentsPage.items
        await nextTick()

        const documentsList = wrapper.findComponent(DocumentsList)
        await nextTick()

        await documentsList.vm.$emit(
          'toolbox-action-triggered',
          'transmit-document'
        )
        await nextTick()

        vi.advanceTimersByTime(300)
        expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
          defaultProps.currentService,
          defaultProps.selectedFolder.id,
          'my-entity',
          0,
          10,
          '-created'
        )
      })

    it('should open drawer when row clicked', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
                [documentsResponsePayload.documentsPage.items[0]]
      await nextTick()
      const documents = wrapper.findComponent(DocumentsList)
      await nextTick()

      const tableRowDocument: TableRowDocument = {
        ...componentInstance.selectedDocuments[0],
        _rowIndex: 0
      }
      await documents.vm.$emit('table-row-clicked', tableRowDocument)

      const documentPreview = wrapper.findComponent(DocumentPreview)

      expect(documentPreview.props('openDrawer')).toBeTruthy()
      expect(documentPreview.props('document'))
        .toStrictEqual(componentInstance.selectedDocuments[0])
    })

    it('should close drawer oppon close-drawer event', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments = [
        documentsResponsePayload.documentsPage.items[0]
      ]
      await nextTick()
      const documents = wrapper.findComponent(DocumentsList)
      await nextTick()

      const tableRowDocument: TableRowDocument = {
        ...componentInstance.selectedDocuments[0],
        _rowIndex: 0
      }

      await documents.vm.$emit('table-row-clicked', tableRowDocument)

      const documentPreview = wrapper.findComponent(DocumentPreview)

      await documentPreview.vm.$emit('close-drawer')
      await nextTick()
      expect(componentInstance.isPreviewDrawerOpened).toBeFalsy()
    })

    // eslint-disable-next-line max-len
    it('should set selectedDocumentsForMove oppon document-selection-change event with valid payload'
      , async () => {
        const wrapper = createWrapper()
        await nextTick()

        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload
        await nextTick()

        const documentsListWrapper = findDocumentsList(wrapper)
        await documentsListWrapper.vm.$emit(
          'document-selection-change',
          [documentMock]
        )
        await nextTick()

        const documentMoveWrapper = findDocumentMove(wrapper)

        expect(documentMoveWrapper.props('selectedDocuments')).toHaveLength(1)

        await documentsListWrapper.vm.$emit(
          'document-selection-change',
          [documentMock]
        )
        await nextTick()

        expect(documentMoveWrapper.props('selectedDocuments')).toHaveLength(1)

      })

    it('should set current page saize oppon on-page-range-changed event ', async () => {

      const wrapper = createWrapper()
      await nextTick()

      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const pPaginationWrapper = findPPagination(wrapper)

      await pPaginationWrapper.vm.$emit('on-page-range-changed', 50)
      await nextTick()

      expect(pPaginationWrapper.props('pPageSize')).toStrictEqual(50)
    })

    it('should open rename document modal oppon rename-document event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const documentListWrapper = findDocumentsList(wrapper)
      await documentListWrapper.vm.$emit(
        'toolbox-action-triggered',
        'rename-document'
      )
      await nextTick()

      expect(componentInstance.isRenameModalOpened).toBeTruthy()

    })
  })
})

