import { describe, it, vi, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import type { DocumentStatusUpdateResponse, DocumentsWithTableStructure } from '@/models/Document'
import type { Folder } from '@/models/Folder'
import { usePiaStatusSync } from './PiaStatusSync'
import { defineComponent, ref, Ref, PropType, nextTick } from 'vue'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import { documentsResponsePayload } from '../mocks/documentsWithTableStructureDataMock'

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  }),
  DataStreamHubConnection: vi.fn(() => ({
    startConnection: vi.fn(() => {
      return Promise.resolve()
    }),
    getConnection: vi.fn(() => {
      return {
        invoke: vi.fn(),
        on: vi.fn().mock.calls,
        stop: vi.fn()
      }
    }),
    destroyConnection: vi.fn()
  }))
}))

vi.mock('@/models/AccountingHubConnection', () => ({
  initializedAccountingDataStreamInstance: Promise.resolve({
    OnConnectedAsync: vi.fn(),
    OnDisconnectedAsync: vi.fn(),
    getConnection: vi.fn(() => ({
      on: vi.fn()
    }))
  })
}))

const testComponent = defineComponent({
  props: {
    folder: {
      type: Object as PropType<Ref<Folder | null>>,
      required: true
    },
    documents: {
      type: Object as PropType<Ref<DocumentsWithTableStructure | null>>,
      required: true
    }
  },
  setup(props) {
    return {
      ...usePiaStatusSync(props.folder, props.documents)
    }
  }
})

describe('usePiaStatusSync', () => {
  it('should update the pia status and permissions of the' +
     'document when the pia status changes', async () => {
    const selectedFolder = ref<Folder | null>(foldersData[1][1])
    const documents = ref<DocumentsWithTableStructure | null>(documentsResponsePayload)
    const { updateDocumentSyncStatusAndPermissions } = usePiaStatusSync(selectedFolder, documents)
    const documentToNotify = documents.value?.documentsPage.items.find(d => d.id === '1234567890')
    expect(documentToNotify?.piaStatus.labelFr).equals('Actif')
    expect(documentToNotify?.permissions).toStrictEqual(['READ', 'WRITE'])

    const newDocumentStatusAndUpdate : DocumentStatusUpdateResponse = {
      folderId: 1,
      documentId: '1234567890',
      newStatus: {
        technicalName: 'Collected',
        labelFr: 'Transmis',
        labelEn: 'Transmitted',
        date: '2023-08-04T12:00:00Z'
      },
      permissions: ['READ']
    }
    updateDocumentSyncStatusAndPermissions(documents, newDocumentStatusAndUpdate)
    expect(documentToNotify?.piaStatus.labelFr).equals('Transmis')
    expect(documentToNotify?.permissions).toStrictEqual(['READ'])
  })

  it('should use OnDisconnectedAsync on folder change', async () => {
    const fakeFolder = ref<Folder | null>(null)
    const documents = ref<DocumentsWithTableStructure | null>(documentsResponsePayload)
    const wrapper = mount(testComponent, {
      props: {
        folder: fakeFolder,
        documents
      }
    })
    await nextTick()
    fakeFolder.value = foldersData[0][0].children[0]
    await nextTick()
    fakeFolder.value = foldersData[0][0].children[1]
    await nextTick()
    const instance = await wrapper.vm.initializedAccountingDataStreamInstance
    expect(instance.OnDisconnectedAsync).toHaveBeenCalled()
  })

  it('should not use OnConnectedAsync on null folder change', async () => {
    const fakeFolder = ref<Folder | null>(foldersData[1][1])
    const documents = ref<DocumentsWithTableStructure | null>(documentsResponsePayload)
    const wrapper = mount(testComponent, {
      props: {
        folder: fakeFolder,
        documents
      }
    })
    await nextTick()
    fakeFolder.value = null
    await nextTick()
    const instance = await wrapper.vm.initializedAccountingDataStreamInstance
    expect(instance.OnConnectedAsync).not.toHaveBeenCalled()
  })
})
