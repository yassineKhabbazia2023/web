
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { foldersData } from '@ged/__mocks__/tree-folders.mocks'
import { documentsResponsePayloadTwoPages } from '@ged/__mocks__/documents.mocks'
import { documentsServiceMock } from '@ged/__mocks__/documents.service.mocks'
import { getConnectionDocumentPiaStatusChangedMock, onConnectedAsyncMock, onDisconnectedAsyncMock } from '@ged/__mocks__/accounting-hub-connection.service.mocks'
import { createPinia, setActivePinia } from 'pinia'
import type { DocumentsProps } from './DocumentsTypes'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import type { Entity } from '@pulse/common/types'
import { fetchFolderDocuments } from '@ged/services/Documents'
import type { Document, DocumentsWithTableStructure } from '@ged/models/Document'

import Documents from './Documents.vue'

 type DocumentsSetup = {
   documents: DocumentsWithTableStructure
   selectedDocument: Document
   selectedDocuments: Document[]
   isLoading:false
 }

export type DocumentsWrapper = VueWrapper<
   ComponentPublicInstance<DocumentsSetup, DocumentsProps>
 >

const pinia = createPinia()

const defaultProps = {
  currentService: foldersData[0][0].children[0].serviceId,
  currentServiceName: 'a service name',
  selectedEntity: 'my-entity',
  accountId: 1234,
  selectedEntityAvatarColor: 'persian' as Entity['color'],
  selectedEntityName: 'This is a legal name',
  selectedFolder: foldersData[0][0].children[0],
  currentServiceFolder: foldersData[0],
}

const responseNoDoc: DocumentsWithTableStructure = {
  documentsPage: {
    items: [],
    totalItems: 0,
    endIndex: 1,
    startIndex: 1,
  },
  documentHeaders: [],
}


vi.mock('@ged/services/Documents', () => documentsServiceMock)

vi.mock('@ged/modules/common/helpers/downloadFilesHelper', () => ({
  downloadFile: vi.fn(),
}))


vi.mock('@ged/models/AccountingHubConnection', () => ({
  initializedAccountingDataStreamInstance: Promise.resolve({
    OnConnectedAsync: onConnectedAsyncMock,
    OnDisconnectedAsync: onDisconnectedAsyncMock,
    getConnection: getConnectionDocumentPiaStatusChangedMock,
  }),
}))

describe('documents', () => {
  beforeEach(() => {
    setActivePinia(pinia)
    flushPromises()
  })
  describe('props', () => {
    it('should not render pagination when there is no document', async () => {
      const wrapper = shallowMount(Documents, {
        props: defaultProps,
        global: {
          stubs: {
            PPagination: true,
            PToolbox: {
              template: '<span />',
            },
          },
          plugins: [pinia],
        },
      }) as unknown as DocumentsWrapper
      await flushPromises()
      const componentInstance = wrapper.vm
      componentInstance.documents = responseNoDoc
      await nextTick()
      const pagination = wrapper.findComponent({ name: 'PPagination' })
      expect(pagination.exists()).toBeFalsy()
    })
  })
  describe('events', () => {
    it('should call fetch documents when on-page-range-changed is emitted', async () => {
      const wrapper = shallowMount(Documents, {
        props: defaultProps,
        global: {
          stubs: {
            PPagination: true,
            PToolbox: {
              template: '<span />',
            },
          },
          plugins: [pinia],
        },
      }) as unknown as DocumentsWrapper
      await flushPromises()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayloadTwoPages

      await nextTick()
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      pagination.vm.$emit('on-page-range-changed', 100)
      await nextTick()

      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        defaultProps.accountId,
        0,
        100,
        '-created',
        null,

      )
    }, 30000)

    it('should call fetch documents when update:current-page is emitted', async () => {
      const wrapper = shallowMount(Documents, {
        props: defaultProps,
        global: {
          stubs: {
            PPagination: true,
            PToolbox: {
              template: '<span />',
            },
          },
          plugins: [pinia],
        },
      }) as unknown as DocumentsWrapper
      await flushPromises()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayloadTwoPages

      await nextTick()
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      pagination.vm.$emit('update:current-page', 2)
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

    it('should call fetch documents when update:page-size is emitted', async () => {
      const wrapper = shallowMount(Documents, {
        props: defaultProps,
        global: {
          stubs: {
            PPagination: true,
            PToolbox: {
              template: '<span />',
            },
          },
          plugins: [pinia],
        },
      }) as unknown as DocumentsWrapper
      await flushPromises()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayloadTwoPages

      await nextTick()
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      pagination.vm.$emit('update:page-size', 25)
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
  })
})
