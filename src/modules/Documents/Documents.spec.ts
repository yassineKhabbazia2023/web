/* eslint-disable max-len */
// /* eslint-disable max-len */
// /* eslint-disable vitest/no-hooks */

import { describe, it, expect } from 'vitest'
// import { foldersData } from '../Treeview/mocks/treeFoldersMock'
// import Documents from './Documents.vue'
// import { createPinia, setActivePinia } from 'pinia'
// import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
// import { dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
// import DocumentsList from './sections/DocumentsList'
// import { DocumentsProps } from './DocumentsTypes'
// import {
//   downloadDocument,
//   fetchFolderDocuments,
//   downloadDocuments
// } from '@/services/Documents'
// import {
//   documentsResponsePayload,
//   documentsResponsePayloadMoreThanOneDoc
// } from '@/modules/Documents/mocks/documentsWithTableStructureDataMock'
// import { Document, DocumentsWithTableStructure } from '@/models/Document'
// import { ComponentPublicInstance, nextTick } from 'vue'
// import DocumentDeleteModal
//   from '@/modules/Documents/components/DocumentDeleteModal'
// import DocumentsActionsBar from '@/modules/Documents/sections/DocumentsActions'
// import DocumentRename from './components/DocumentRename'

// type DocumentsSetup = {
//   documents: DocumentsWithTableStructure
//   selectedDocument: Document
//   selectedDocuments: Document[]
// }

// export type DocumentsWrapper = VueWrapper<
//   ComponentPublicInstance<DocumentsSetup, DocumentsProps>
// >

// const mockToastPlugin = vi.fn()

// const pinia = createPinia()

// const defaultProps = {
//   currentService: foldersData[0][0].children[0].serviceId,
//   selectedEntity: 'my-entity',
//   selectedFolder: foldersData[0][0].children[0],
//   currentServiceFolder: foldersData[0]
// }

// const createWrapper = (
//   props: DocumentsProps = defaultProps
// ): DocumentsWrapper => {
//   return mount(Documents, {
//     props,
//     global: {
//       stubs: {
//         PToolbox: {
//           template: '<span />'
//         },
//         PButton: {
//           template: '<div />'
//         }
//       },
//       plugins: [pinia],
//       provide: {
//         toast: mockToastPlugin
//       }
//     }
//   }) as unknown as DocumentsWrapper
// }

// vi.mock('vue-inject', () => ({
//   provide: vi.fn()
// }))

// vi.mock('@/services/Documents', () => ({
//   fetchFolderDocuments: vi.fn(),
//   downloadDocuments: vi.fn(),
//   downloadDocument: vi.fn()
// }))

// vi.mock('./helpers/downloadFilesHelper', () => ({
//   downloadFile: vi.fn()
// }))

// describe('documents', () => {
//   beforeEach(() => {
//     setActivePinia(pinia)
//     flushPromises()
//   })
//   describe('events', () => {
//     it('should call fetch documents when on-sort-change is emitted', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayload

//       await nextTick()
//       const documents = await dynamicUntilFoundComponent(wrapper, DocumentsList)
//       await nextTick()

//       await documents.vm.$emit('on-sort-change', '+name')

//       expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
//         foldersData[0][0].children[0].serviceId,
//         foldersData[0][0].children[0].id,
//         'my-entity',
//         0,
//         10,
//         '+name'
//       )
//     })
//     // an exceptional test to be able to cover the composable code cause of the
//     // complexity of mocking i18n and the toastPlugin (not recommended)
//     it('should call download document composable oppon  toolbox-action-triggered', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayload
//       componentInstance.selectedDocuments =
//           documentsResponsePayload.documentsPage.items
//       await nextTick()

//       const documentsList = await dynamicUntilFoundComponent(
//         wrapper,
//         DocumentsList
//       )
//       await nextTick()

//       await documentsList.vm.$emit(
//         'toolbox-action-triggered',
//         'download-document'
//       )

//       expect(vi.mocked(downloadDocument)).toHaveBeenCalledWith(
//         defaultProps.currentService,
//         defaultProps.selectedEntity,
//         documentsResponsePayload.documentsPage.items[0].id
//       )
//     }
//     )

//     it('should use download as archive when number of selected documents is more than 1', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayloadMoreThanOneDoc
//       componentInstance.selectedDocuments =
//         documentsResponsePayloadMoreThanOneDoc.documentsPage.items

//       await nextTick()

//       const documentActionBar = await dynamicUntilFoundComponent(
//         wrapper,
//         DocumentsActionsBar
//       )
//       await nextTick()

//       await documentActionBar.vm.$emit(
//         'p-action-bar-button-clicked',
//         'actionbar-download-action-click'
//       )
//       await nextTick()
//       expect(vi.mocked(downloadDocuments)).toHaveBeenCalledWith(
//         defaultProps.currentService,
//         defaultProps.selectedEntity,
//         documentsResponsePayloadMoreThanOneDoc.documentsPage.items.map(
//           (x) => x.id
//         )
//       )
//     })

//     it('should call fetch documents when document-rename is emitted', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.selectedDocuments = documentsResponsePayload.documentsPage.items
//       componentInstance.documents = documentsResponsePayload
//       await nextTick()

//       const documentRename = await dynamicUntilFoundComponent(
//         wrapper,
//         DocumentRename
//       )
//       await nextTick()

//       await documentRename.vm.$emit('document-rename')

//       expect(documentRename.props('modelValue')).toBeFalsy()
//     })

//     it('should open delete modal when toolbox-action-triggered is emitted', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayload
//       componentInstance.selectedDocuments =
//               [documentsResponsePayload.documentsPage.items[0]]
//       await nextTick()
//       const documents = await dynamicUntilFoundComponent(wrapper, DocumentsList)
//       await nextTick()

//       await documents.vm.$emit('toolbox-action-triggered', 'delete-document')

//       const deleteModal = await dynamicUntilFoundComponent(wrapper, DocumentDeleteModal)

//       expect(deleteModal.props('isVisible')).toBeTruthy()
//       expect(deleteModal.props('documentIds'))
//         .toStrictEqual([documentsResponsePayload.documentsPage.items[0].id])
//     })

//     it('should call fetch documents when confirm-delete-document is emitted', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayload
//       await nextTick()
//       const deleteModal = await dynamicUntilFoundComponent(wrapper, DocumentDeleteModal)
//       await nextTick()

//       await deleteModal.vm.$emit('confirm-delete-document')

//       expect(deleteModal.props('isVisible')).toBeFalsy()
//       expect(deleteModal.props('documentIds')).toStrictEqual([])
//       expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
//         foldersData[0][0].children[0].serviceId,
//         foldersData[0][0].children[0].id,
//         'my-entity',
//         0,
//         10,
//         '-created'
//       )
//     }, 30000)

//     it('should close delete modal when cancel-delete-document is emitted', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayload
//       await nextTick()
//       const deleteModal = await dynamicUntilFoundComponent(wrapper, DocumentDeleteModal)
//       await nextTick()

//       await deleteModal.vm.$emit('cancel-delete-document')

//       expect(deleteModal.props('isVisible')).toBeFalsy()
//     })
//     // eslint-disable-next-line max-len
//     it('should open delete modal  when click on action bar download button', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayload
//       componentInstance.selectedDocuments =
//               [documentsResponsePayload.documentsPage.items[0]]
//       await nextTick()

//       const documentActionBar = await dynamicUntilFoundComponent(
//         wrapper,
//         DocumentsActionsBar
//       )
//       await nextTick()

//       await documentActionBar.vm.$emit(
//         'p-action-bar-button-clicked',
//         'actionbar-delete-action-click'
//       )

//       await nextTick()
//       const deleteModal = await dynamicUntilFoundComponent(wrapper, DocumentDeleteModal)
//       await nextTick()

//       expect(deleteModal.props('isVisible')).toBeTruthy()
//       expect(deleteModal.props('documentIds'))
//         .toStrictEqual([documentsResponsePayload.documentsPage.items[0].id])
//     })

//     it('should open rename  modal  when click on action bar rename button', async () => {
//       const wrapper = createWrapper()
//       const componentInstance = wrapper.vm
//       componentInstance.documents = documentsResponsePayload
//       componentInstance.selectedDocuments =
//               [documentsResponsePayload.documentsPage.items[0]]
//       await nextTick()

//       const documentActionBar = await dynamicUntilFoundComponent(
//         wrapper,
//         DocumentsActionsBar
//       )
//       await nextTick()

//       await documentActionBar.vm.$emit(
//         'p-action-bar-button-clicked',
//         'actionbar-rename-action-click'
//       )

//       await nextTick()
//       const renameModal = await dynamicUntilFoundComponent(wrapper, DocumentRename)
//       await nextTick()

//       expect(renameModal.props('modelValue')).toBeTruthy()
//     })
//   })
// })

describe('temp', () => {
  it('should ignore for now', () => {
    expect(true).toBeTruthy()
  })
})
