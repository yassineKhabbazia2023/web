import { foldersData } from '@ged/__mocks__/tree-folders.mocks'
import { documentMock, documentsResponsePayload, documentsResponsePayloadMoreThanOneDoc } from '@ged/__mocks__/documents.mocks'
import { generateTestFiles, validDestination } from '@ged/__mocks__/files.mocks'
import { documentsServiceMock, fetchDocumentsByKeyWordMock, previewDocumentMock } from '@ged/__mocks__/documents.service.mocks'
import { getConnectionDocumentPiaStatusChangedMock, onConnectedAsyncMock, onDisconnectedAsyncMock } from '@ged/__mocks__/accounting-hub-connection.service.mocks'
import type { ComponentWrapper } from '@ged/__mocks__/component.wrapper'
import { flushPromises, mount } from '@vue/test-utils'
import type { DocumentsProps } from './DocumentsTypes'
import {
  downloadDocument,
  fetchFolderDocuments,
  downloadDocuments,
  transmitDocuments,
  fetchDocumentsByKeyWord,
} from '@ged/services/Documents'
import type { TableRowDocument } from '@ged/models/Document'
import { nextTick } from 'vue'
import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'
import type { Entity } from '@pulse/common/types'
import {
  trackDocumentConsulted,
  trackDocumentDeleteFlowStart,
  trackDocumentMoveFlowStart,
  trackDocumentRenameFlowStart,
  trackDocumentTransmitFlowStart,
  trackDocumentDownloadFlowStart,
  trackDocumentSearch,
  trackBreadcrumbUsage,
} from '@ged/services/tracking/tracking.service'
import { TriggerSource } from '@ged/services/tracking/tracking.types'

import Documents from './Documents.vue'

type DocumentsWrapper = ComponentWrapper<InstanceType<typeof Documents>>

const defaultProps: DocumentsProps = {
  currentService: foldersData[0][0].children[0].serviceId,
  currentServiceName: 'cool service name',
  selectedEntity: 'my-entity',
  accountId: 1234,
  selectedEntityAvatarColor: 'persian' as Entity['color'],
  selectedEntityName: 'This is a legal name',
  selectedFolder: foldersData[0][0].children[0],
  currentServiceFolder: foldersData[0],
}

vi.mock('@ged/services/tracking/tracking.service')

const createWrapper = (
  props: DocumentsProps = defaultProps,
): DocumentsWrapper => {
  return mount(Documents, {
    shallow: true,
    props,
    global: {
    },
  })
}

vi.mock('@ged/services/Documents', () => ({
  ...documentsServiceMock,
  fetchDocumentsByKeyWord: fetchDocumentsByKeyWordMock,
  previewDocument: previewDocumentMock,
}))

vi.mock('@ged/modules/common/downloadFilesHelper', () => ({
  downloadFile: vi.fn(),
}))

vi.mock('@ged/models/AccountingHubConnection', () => ({
  initializedAccountingDataStreamInstance: Promise.resolve({
    OnConnectedAsync: onConnectedAsyncMock,
    OnDisconnectedAsync: onDisconnectedAsyncMock,
    getConnection: getConnectionDocumentPiaStatusChangedMock,
  }),
}))

const generateTestString = (stringLength: number) => {
  let str = ''
  for (let i = 0; i < stringLength; i++) {
    str += 'a'
  }
  return str
}
describe('documents', () => {
  const findDocumentActionBar = (wrapper: DocumentsWrapper) => wrapper.findComponent({ name: 'DocumentsActionsBar' })
  const findDocumentUpload = (wrapper: DocumentsWrapper) => wrapper.findComponent({ name: 'DocumentsUpload' })
  const findDocumentMove = (wrapper: DocumentsWrapper) => wrapper.findComponent({ name: 'DocumentsMove' })
  const findDocumentsList = (wrapper: DocumentsWrapper) => wrapper.findComponent({ name: 'DocumentsList' })
  const findPBreadCrumb = (wrapper: DocumentsWrapper) => wrapper.findComponent({ name: 'PBreadcrumb' })
  const findPPagination = (wrapper: DocumentsWrapper) => wrapper.findComponent({ name: 'PPagination' })

  const findDocumentsSearchAlert = (wrapper: DocumentsWrapper) =>
    wrapper.findComponent({ name: 'DocumentsSearchAlert' })
  beforeEach(() => {
    flushPromises()
    vi.useFakeTimers()
  })
  describe('events', () => {
    it('should set selected files on p-upload-files-selected', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentActionBarWrapper = findDocumentActionBar(wrapper)

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
        validDestination,
      )
      await nextTick()

      expect(wrapper.emitted('update-source-folders')).toHaveLength(1)
      expect(wrapper.emitted('update-source-folders')).toStrictEqual([[validDestination]])
    })

    it('should open move modal upon documents list toolbox-action-triggered event', async () => {
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

    it('should close move modal upon DocumentMove close-move-documents-modal event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentMoveWrapper = findDocumentMove(wrapper)
      await documentMoveWrapper.vm.$emit(
        'close-move-documents-modal',
      )
      await nextTick()

      expect(documentMoveWrapper.props('isMoveModalOpened')).toBeFalsy()
    })

    it('should close modal upon DocumentUpload close-upload-documents-modal event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentUploadWrapper = findDocumentUpload(wrapper)
      await documentUploadWrapper.vm.$emit(
        'close-upload-documents-modal',
      )
      await nextTick()

      expect(documentUploadWrapper.props('isUploadModalOpened')).toBeFalsy()
    })

    it('should navigate to folder upon PBreadcrumb p-breadcrumb-item-click event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const pbreadCrumbWrapper = findPBreadCrumb(wrapper)
      pbreadCrumbWrapper.vm.$emit('p-breadcrumb-item-click', validDestination.id)
      await nextTick()

      expect(trackBreadcrumbUsage).toHaveBeenCalledOnce()
      expect(wrapper.emitted('change-selected-folder')).toHaveLength(1)
      expect(wrapper.emitted('change-selected-folder')).toStrictEqual([[validDestination]])
    })

    it('should call fetch documents when on-sort-change is emitted', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.isSearchExpanded = false

      await nextTick()
      const documents = wrapper.findComponent({ name: 'DocumentsList' })
      await nextTick()

      await documents.vm.$emit('on-sort-change', '-created')
      await nextTick()

      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        defaultProps.accountId,
        0,
        10,
        '-created',
        null,
      )
    })

    it('should call searchDocumentsByKeyWord when on-sort-change is emitted while in search state',
      async () => {
        const wrapper = createWrapper()
        await nextTick()

        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload
        componentInstance.isSearchExpanded = true
        componentInstance.searchContent = 'Hello'
        await nextTick()

        const documents = wrapper.findComponent({ name: 'DocumentsList' })

        await documents.vm.$emit('on-sort-change', '+name')
        await nextTick()

        expect(vi.mocked(fetchDocumentsByKeyWord)).toHaveBeenCalledWith(
          foldersData[0][0].children[0].serviceId,
          foldersData[0][0].children[0].id,
          'my-entity',
          defaultProps.accountId,
          0,
          10,
          '+name',
          'Hello',
        )
      })

    it('should call download document composable upon  toolbox-action-triggered', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
        documentsResponsePayload.documentsPage.items
      await nextTick()

      const documentsList = wrapper.findComponent({ name: 'DocumentsList' })
      await nextTick()

      await documentsList.vm.$emit(
        'toolbox-action-triggered',
        'download-document',
      )
      await nextTick()

      expect(vi.mocked(downloadDocument)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        documentsResponsePayload.documentsPage.items[0].id,
        defaultProps.accountId,
      )
    },
    )

    it('should use download as archive when number of ' +
      'selected documents is more than 1', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayloadMoreThanOneDoc
      componentInstance.selectedDocuments =
          documentsResponsePayloadMoreThanOneDoc.documentsPage.items

      await nextTick()

      const documentActionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-download-action-click',
      )
      await nextTick()
      expect(vi.mocked(downloadDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        documentsResponsePayloadMoreThanOneDoc.documentsPage.items.map(
          (x) => x.id,
        ),
        defaultProps.accountId,
      )
    })

    it('should call fetch documents when document-rename is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.selectedDocuments = documentsResponsePayload.documentsPage.items
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const documentRename = wrapper.findComponent({ name: 'DocumentRename' })

      await nextTick()

      await documentRename.vm.$emit('document-rename')
      await nextTick()

      expect(documentRename.props('modelValue')).toBeFalsy()
    })

    it('should open delete modal when toolbox-action-triggered is emitted', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
        [documentsResponsePayload.documentsPage.items[0]]
      await nextTick()
      const documents = wrapper.findComponent({ name: 'DocumentsList' })
      await nextTick()

      await documents.vm.$emit('toolbox-action-triggered', 'delete-document')
      await nextTick()

      const deleteModal = wrapper.findComponent({ name: 'DocumentDeleteModal' })

      expect(deleteModal.props('isVisible')).toBeTruthy()
      expect(deleteModal.props('documentIds'))
        .toStrictEqual([documentsResponsePayload.documentsPage.items[0].id])
    })

    it('should call fetch documents when confirm-delete-document is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.isSearchExpanded = false
      await nextTick()
      const deleteModal = wrapper.findComponent({ name: 'DocumentDeleteModal' })
      await nextTick()

      await deleteModal.vm.$emit('confirm-delete-document')
      await nextTick()

      expect(deleteModal.props('isVisible')).toBeFalsy()
      expect(deleteModal.props('documentIds')).toStrictEqual([])
      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        defaultProps.accountId,
        0,
        10,
        '-created',
        null,
      )
    }, 30000)

    it(
      'should call search documents when confirm-delete-document is emitted while in search state',
      async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload
        componentInstance.isSearchExpanded = true
        componentInstance.searchContent = 'Hello'

        await nextTick()
        const deleteModal = wrapper.findComponent({ name: 'DocumentDeleteModal' })
        await nextTick()

        await deleteModal.vm.$emit('confirm-delete-document')
        await nextTick()

        expect(deleteModal.props('isVisible')).toBeFalsy()
        expect(deleteModal.props('documentIds')).toStrictEqual([])
        expect(vi.mocked(fetchDocumentsByKeyWord)).toHaveBeenCalledWith(
          foldersData[0][0].children[0].serviceId,
          foldersData[0][0].children[0].id,
          'my-entity',
          defaultProps.accountId,
          0,
          10,
          '-created',
          'Hello',
        )
      }, 30000)

    it('should close delete modal when cancel-delete-document is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()
      const deleteModal = wrapper.findComponent({ name: 'DocumentDeleteModal' })
      await nextTick()

      await deleteModal.vm.$emit('cancel-delete-document')
      await nextTick()

      expect(deleteModal.props('isVisible')).toBeFalsy()
    })

    it('should open delete modal  when click on action bar download button', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
        [documentsResponsePayload.documentsPage.items[0]]
      await nextTick()

      const documentActionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-delete-action-click',
      )

      await nextTick()
      const deleteModal = wrapper.findComponent({ name: 'DocumentDeleteModal' })
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

      const documentActionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-rename-action-click',
      )

      await nextTick()
      const renameModal = wrapper.findComponent({ name: 'DocumentRename' })
      await nextTick()

      expect(renameModal.props('modelValue')).toBeTruthy()
    })


    it('should call transmit document composable upon  toolbox-action-triggered', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
        documentsResponsePayload.documentsPage.items
      await nextTick()

      const documentsList = wrapper.findComponent({ name: 'DocumentsList' })
      await nextTick()

      await documentsList.vm.$emit(
        'toolbox-action-triggered',
        'transmit-document',
      )
      await nextTick()

      expect(vi.mocked(transmitDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        [documentsResponsePayload.documentsPage.items[0].id],
        defaultProps.accountId,
      )
    })


    it('should not call transmit document composable upon  toolbox-action-triggered whe no selected documents', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload

      await nextTick()

      const documentsList = wrapper.findComponent({ name: 'DocumentsList' })
      await nextTick()

      await documentsList.vm.$emit(
        'toolbox-action-triggered',
        'transmit-document',
      )
      await nextTick()

      expect(vi.mocked(transmitDocuments)).toHaveBeenCalledTimes(0)
    })

    it('should call transmit document composable upon click on action bar transmit button', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments = [
        documentsResponsePayload.documentsPage.items[0],
      ]
      await nextTick()

      const documentActionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-transmit-action-click',
      )

      await nextTick()
      expect(vi.mocked(transmitDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedEntity,
        [documentsResponsePayload.documentsPage.items[0].id],
        defaultProps.accountId,
      )
    })

    it('should call fetch documents upon transmit documents event', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments = [
        documentsResponsePayload.documentsPage.items[0],
      ]
      await nextTick()

      const documentActionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-transmit-action-click',
      )
      await nextTick()

      vi.advanceTimersByTime(300)
      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedFolder?.id,
        'my-entity',
        defaultProps.accountId,
        0,
        10,
        '-created',
        null,
      )
    })

    it('should call fetch documents upon transmit documents event triggered from toolbox',
      async () => {
        const wrapper = createWrapper()
        await nextTick()
        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload
        componentInstance.selectedDocuments =
          documentsResponsePayload.documentsPage.items
        componentInstance.isSearchExpanded = false

        await nextTick()

        const documentsList = wrapper.findComponent({ name: 'DocumentsList' })
        await nextTick()

        await documentsList.vm.$emit(
          'toolbox-action-triggered',
          'transmit-document',
        )
        await nextTick()

        vi.advanceTimersByTime(300)
        expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
          defaultProps.currentService,
          defaultProps.selectedFolder?.id,
          'my-entity',
          defaultProps.accountId,
          0,
          10,
          '-created',
          null,
        )
      })

    it('should call search documents upon transmit documents event triggered from toolbox',
      async () => {
        const wrapper = createWrapper()
        await nextTick()

        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload
        componentInstance.selectedDocuments =
          documentsResponsePayload.documentsPage.items
        componentInstance.isSearchExpanded = true
        componentInstance.searchContent = 'Hello'

        await nextTick()
        const documentsList = wrapper.findComponent({ name: 'DocumentsList' })

        await documentsList.vm.$emit(
          'toolbox-action-triggered',
          'transmit-document',
        )
        await nextTick()

        vi.advanceTimersByTime(300)

        expect(vi.mocked(fetchDocumentsByKeyWord)).toHaveBeenCalledWith(
          foldersData[0][0].children[0].serviceId,
          foldersData[0][0].children[0].id,
          'my-entity',
          defaultProps.accountId,
          0,
          10,
          '-created',
          'Hello',
        )
      })

    it('should open drawer when row clicked', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments =
        [documentsResponsePayload.documentsPage.items[0]]
      await nextTick()
      const documents = wrapper.findComponent({ name: 'DocumentsList' })
      await nextTick()

      const tableRowDocument: TableRowDocument = {
        ...componentInstance.selectedDocuments[0],
        _rowIndex: 0,
      }
      await documents.vm.$emit('table-row-double-clicked', tableRowDocument)
      await nextTick()

      const documentPreview = wrapper.findComponent({ name: 'DocumentPreview' })

      expect(documentPreview.props('openDrawer')).toBeTruthy()
      expect(documentPreview.props('document'))
        .toStrictEqual({
          _rowIndex: 0,
          ...componentInstance.selectedDocuments[0],
        })
      expect(trackDocumentConsulted).toHaveBeenCalled()
    })

    it('should close drawer upon close-drawer event', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments = [
        documentsResponsePayload.documentsPage.items[0],
      ]
      await nextTick()
      const documents = wrapper.findComponent({ name: 'DocumentsList' })
      await nextTick()

      const tableRowDocument: TableRowDocument = {
        ...componentInstance.selectedDocuments[0],
        _rowIndex: 0,
      }

      await documents.vm.$emit('table-row-double-clicked', tableRowDocument)
      await nextTick()

      const documentPreview = wrapper.findComponent({ name: 'DocumentPreview' })

      await documentPreview.vm.$emit('close-drawer')
      await nextTick()
      expect(componentInstance.isPreviewDrawerOpened).toBeFalsy()
    })


    it('should set selectedDocumentsForMove upon document-selection-change event with valid payload'
      , async () => {
        const wrapper = createWrapper()
        await nextTick()

        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload
        await nextTick()

        const documentsListWrapper = findDocumentsList(wrapper)
        await documentsListWrapper.vm.$emit(
          'document-selection-change',
          [documentMock],
        )
        await nextTick()

        const documentMoveWrapper = findDocumentMove(wrapper)

        expect(documentMoveWrapper.props('selectedDocuments')).toHaveLength(1)

        await documentsListWrapper.vm.$emit(
          'document-selection-change',
          [documentMock],
        )
        await nextTick()

        expect(documentMoveWrapper.props('selectedDocuments')).toHaveLength(1)
      })

    it('should set current page size upon on-page-range-changed event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const pPaginationWrapper = findPPagination(wrapper)

      pPaginationWrapper.vm.$emit('on-page-range-changed', 50)
      await nextTick()

      expect(pPaginationWrapper.props('pPageSize')).toBe(50)
    })

    it('should open rename document modal upon rename-document event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const documentListWrapper = findDocumentsList(wrapper)
      await documentListWrapper.vm.$emit(
        'toolbox-action-triggered',
        'rename-document',
      )
      await nextTick()

      expect(componentInstance.isRenameModalOpened).toBeTruthy()
    })

    it('should call fetchDocumentsByKeyWord upon p-search-input', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload

      const documentsActionBarWrapper = findDocumentActionBar(wrapper)

      await documentsActionBarWrapper.vm.$emit('p-search-input', 'Hello')
      await nextTick()

      expect(vi.mocked(fetchDocumentsByKeyWord)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        defaultProps.accountId,
        0,
        10,
        '-created',
        'Hello',
      )
    })

    it('should display the loader upon p-search-input', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload

      const documentsActionBarWrapper = findDocumentActionBar(wrapper)

      documentsActionBarWrapper.vm.$emit('p-search-input', 'Hello')
      await nextTick()
      expect(wrapper.find('.search-loader').exists()).toBeTruthy()
    })

    it(

      'should not call fetchDocumentsByKeyWord upon p-search-input and search key is more than 256 chars',
      async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload

        const documentsActionBarWrapper = findDocumentActionBar(wrapper)

        const keyWord = generateTestString(1000)
        await documentsActionBarWrapper.vm.$emit('p-search-input', keyWord)
        await nextTick()

        expect(vi.mocked(fetchDocumentsByKeyWord)).toHaveBeenCalledTimes(0)
      })

    it(
      'should not call fetchDocumentsByKeyWord upon p-search-input and search key an empty string or empty spaces', async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.documents = documentsResponsePayload

        const documentsActionBarWrapper = findDocumentActionBar(wrapper)

        const keyWord = ''
        await documentsActionBarWrapper.vm.$emit('p-search-input', keyWord)
        await nextTick()

        expect(vi.mocked(fetchDocumentsByKeyWord)).toHaveBeenCalledTimes(0)
      })

    describe('should display the search results alerts upon meeting the right conditions',
      () => {
        const cases = [
          {
            params: {
              searchContent: 'Hello',
              isSearchExpanded: true,
              isSearchLoading: false,
            },
            expectedResult: true,
          },
          {
            params: {
              searchContent: '',
              isSearchExpanded: true,
              isSearchLoading: false,
            },
            expectedResult: false,
          },
          {
            params: {
              searchContent: '',
              isSearchExpanded: false,
              isSearchLoading: false,
            },
            expectedResult: false,
          },
        ]

        it.each(cases)(
          'pText mapping validation',
          async ({ params, expectedResult }) => {
            const wrapper = createWrapper()
            const componentInstance = wrapper.vm
            componentInstance.documents = documentsResponsePayload

            componentInstance.searchContent = params.searchContent
            componentInstance.isSearchExpanded = params.isSearchExpanded
            componentInstance.isSearchLoading = params.isSearchLoading

            const documentsActionBarWrapper = findDocumentActionBar(wrapper)

            await documentsActionBarWrapper.vm.$emit(
              'p-search-input',
              params.searchContent,
            )
            await nextTick()

            const documentsSearchAlertWrapper =
              findDocumentsSearchAlert(wrapper)
            await nextTick()

            expect(documentsSearchAlertWrapper.exists()).toBe(expectedResult)
          },
        )
      })

    it('should redirect to document location upon go-to-document event', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments.push(
        documentsResponsePayload.documentsPage.items[0],
      )
      await nextTick()

      const actionBarWrapper = findDocumentActionBar(wrapper)

      actionBarWrapper.vm.$emit('search-expand-change', true)
      await nextTick()

      const documentsList = wrapper.findComponent({ name: 'DocumentsList' })

      await documentsList.vm.$emit(
        'toolbox-action-triggered',
        'go-to-document',
      )
      await nextTick()

      vi.useFakeTimers()
      vi.advanceTimersByTime(1000)
      expect(wrapper.emitted('change-selected-folder')).toBeTruthy()
    })

    it('should close filters drawer when close-filters-drawer event is emitted', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.isFiltersDrawerOpened = true
      await nextTick()

      const drawer = wrapper.findComponent({ name: 'DocumentSearchFilter' })
      await drawer.vm.$emit(
        'close-filters-drawer',
      )
      await nextTick()

      const drawerAfter = wrapper.findComponent({ name: 'DocumentSearchFilter' })
      expect(drawerAfter.exists()).toBeFalsy()
    })

    it('should open filters drawer when p-action-bar-button-clicked event', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const documentActionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-filter-action-click',
      )
      await nextTick()
      const drawer = wrapper.findComponent({ name: 'DocumentSearchFilter' })
      await nextTick()

      expect(drawer.exists()).toBeTruthy()
      expect(drawer.props('modelValue')).toBeTruthy()
    })

    it('should fetch documents when apply-filters-drawer event is emitted', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()
      const componentInstance = wrapper.vm
      componentInstance.isFiltersDrawerOpened = true
      await nextTick()

      const res: DocumentSearchFilters = {
        selectedPeriod: 'DAY',
        startDate: new Date(1998, 11, 19),
        endDate: new Date(1998, 11, 19),
      }

      const drawer = wrapper.findComponent({ name: 'DocumentSearchFilter' })
      await drawer.vm.$emit(
        'apply-filters-drawer', res,
      )
      await nextTick()

      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        defaultProps.currentService,
        defaultProps.selectedFolder?.id,
        'my-entity',
        defaultProps.accountId,
        0,
        10,
        '-created',
        res,
      )

      expect(wrapper.vm.isFiltersDrawerOpened).toBeFalsy()
    })

    it('should handle filters reset', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      const actionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })

      await actionBar.vm.$emit(
        'p-action-bar-button-clicked',
        'actionbar-filter-action-click',
      )

      await nextTick()
      const documentSearchFiltersWrapper = wrapper.findComponent({ name: 'DocumentSearchFilter' })
      documentSearchFiltersWrapper.vm.$emit('reset-filters-drawer')
      await nextTick()

      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        defaultProps.accountId,
        0,
        10,
        '-created',
        null,
      )
      expect(documentSearchFiltersWrapper.exists()).toBeFalsy()
    })
  })
})

describe('tracking', () => {
  it.each([
    {
      toolboxEventName: 'download-document',
      expectedTrackFunction: trackDocumentDownloadFlowStart,
    },
    {
      toolboxEventName: 'rename-document',
      expectedTrackFunction: trackDocumentRenameFlowStart,
    },
    {
      toolboxEventName: 'delete-document',
      expectedTrackFunction: trackDocumentDeleteFlowStart,
    },
    {
      toolboxEventName: 'move-document',
      expectedTrackFunction: trackDocumentMoveFlowStart,
    },
    {
      toolboxEventName: 'transmit-document',
      expectedTrackFunction: trackDocumentTransmitFlowStart,
    },
  ])(
    'should call the appropriate tracking function with the "context menu" trigger source when toolbox action is triggered',
    async ({ toolboxEventName, expectedTrackFunction }) => {
      const wrapper = createWrapper()
      await nextTick()

      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()

      const documentsListWrapper = wrapper.findComponent({ name: 'DocumentsList' })
      await documentsListWrapper.vm.$emit('toolbox-action-triggered', toolboxEventName)
      await nextTick()

      expect(expectedTrackFunction).toHaveBeenCalledWith(TriggerSource.CONTEXT_MENU)
    },
  )

  it.each([
    {
      toolboxEventName: 'actionbar-download-action-click',
      expectedTrackFunction: trackDocumentDownloadFlowStart,
    },
    {
      toolboxEventName: 'actionbar-rename-action-click',
      expectedTrackFunction: trackDocumentRenameFlowStart,
    },
    {
      toolboxEventName: 'actionbar-delete-action-click',
      expectedTrackFunction: trackDocumentDeleteFlowStart,
    },
    {
      toolboxEventName: 'actionbar-move-action-click',
      expectedTrackFunction: trackDocumentMoveFlowStart,
    },
    {
      toolboxEventName: 'actionbar-transmit-action-click',
      expectedTrackFunction: trackDocumentTransmitFlowStart,
    },
  ])(
    'should call the appropriate tracking function with the "action bar" trigger source when $toolboxEventName action bar action is triggered',
    async ({ toolboxEventName, expectedTrackFunction }) => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      componentInstance.selectedDocuments = [
        documentsResponsePayload.documentsPage.items[0],
      ]

      await nextTick()

      const documentActionBar = wrapper.findComponent({ name: 'DocumentsActionsBar' })
      await nextTick()

      await documentActionBar.vm.$emit(
        'p-action-bar-button-clicked',
        toolboxEventName,
      )
      await nextTick()
      await flushPromises()

      expect(expectedTrackFunction).toHaveBeenCalledWith(TriggerSource.ACTION_BAR)
    },
  )

  it('should track the searched value', async () => {
    const wrapper = createWrapper()
    const searchContent = 'Hello'
    const componentInstance = wrapper.vm
    componentInstance.documents = documentsResponsePayload
    componentInstance.isSearchExpanded = true
    componentInstance.searchContent = searchContent

    await nextTick()
    expect(trackDocumentSearch).toHaveBeenCalledWith(searchContent)
  })
})
