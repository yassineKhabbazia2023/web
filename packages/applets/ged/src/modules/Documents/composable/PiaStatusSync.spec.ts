import { defineComponent, ref, nextTick } from 'vue'
import { onConnectedAsyncMock, onDisconnectedAsyncMock, getConnectionMock } from '@ged/__mocks__/accounting-hub-connection.service.mocks'
import type { Ref, PropType } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'
import { foldersData } from '@ged/__mocks__/tree-folders.mocks'
import { documentsResponsePayload } from '@ged/__mocks__/documents.mocks'
import type { DocumentStatusUpdateResponse, DocumentsWithTableStructure } from '@ged/models/Document'
import type { Folder } from '@ged/models/Folder'
import { Permissions } from '@ged/models/Permissions'

import { usePiaStatusSync } from './PiaStatusSync'

const getConnectionOnMocked = vi.hoisted(() => vi.fn())

beforeEach(() => {
  getConnectionMock.mockImplementation(() => ({ on: getConnectionOnMocked }))
})

const testComponent = defineComponent({
  template: '<div />',
  props: {
    folder: {
      type: Object as PropType<Ref<Folder | null>>,
      required: true,
    },
    documents: {
      type: Object as PropType<Ref<DocumentsWithTableStructure | null>>,
      required: true,
    },
  },
  setup(props) {
    usePiaStatusSync(props.folder, props.documents)
  },
})

function getWrapper(
  folder: Ref<Folder | null>,
  documents: Ref<DocumentsWithTableStructure | null>,
) {
  return mount(testComponent, {
    props: {
      folder,
      documents,
    },
  })
}

const DOCUMENT_ID = '1234567890'

describe('usePiaStatusSync', () => {
  it('should not update the pia status and permissions of the document when the pia status does NOT change', () => {
    const selectedFolder = ref<Folder | null>(foldersData[1][1])
    const documents = ref<DocumentsWithTableStructure | null>(structuredClone(documentsResponsePayload))
    getWrapper(selectedFolder, documents)

    const documentToNotify = documents.value?.documentsPage.items.find(d => d.id === DOCUMENT_ID)
    expect(documentToNotify?.piaStatus.labelFr).equals('Actif')
    expect(documentToNotify?.permissions).toStrictEqual(['READ', 'WRITE', 'CAN_DELETE_DOCUMENT'])
  })

  it('should update the pia status and permissions of the document when the pia status changes', async () => {
    const selectedFolder = ref<Folder | null>(foldersData[1][1])
    const documents = ref<DocumentsWithTableStructure | null>(structuredClone(documentsResponsePayload))
    getConnectionOnMocked.mockImplementation((_: string, done: Function) => {
      const newDocumentStatusAndUpdate : DocumentStatusUpdateResponse = {
        folderId: 1,
        documentId: DOCUMENT_ID,
        newStatus: {
          technicalName: 'Collected',
          labelFr: 'Transmis',
          labelEn: 'Transmitted',
          date: '2023-08-04T12:00:00Z',
        },
        permissions: [Permissions.READ],
      }
      const response = JSON.stringify(newDocumentStatusAndUpdate)
      done(response)
    })
    getWrapper(selectedFolder, documents)
    await flushPromises()

    const documentToNotify = documents.value?.documentsPage.items.find(d => d.id === DOCUMENT_ID)

    expect(documentToNotify?.piaStatus.labelFr).equals('Transmis')
    expect(documentToNotify?.permissions).toStrictEqual(['READ'])
  })

  it('should use OnDisconnectedAsync on folder change', async () => {
    const fakeFolder = ref<Folder | null>(null)
    const documents = ref<DocumentsWithTableStructure | null>(structuredClone(documentsResponsePayload))
    getWrapper(fakeFolder, documents)

    await nextTick()
    fakeFolder.value = foldersData[0][0].children[0]
    await nextTick()
    fakeFolder.value = foldersData[0][0].children[1]
    await nextTick()
    await flushPromises()
    const folderId = documentsResponsePayload.documentsPage.items.at(0)?.folder.id
    expect(onDisconnectedAsyncMock).toHaveBeenCalledOnce()
    expect(onDisconnectedAsyncMock).toHaveBeenNthCalledWith(1, folderId)
  })

  it('should not use OnConnectedAsync on null folder change', async () => {
    const fakeFolder = ref<Folder | null>(foldersData[1][1])
    const documents = ref<DocumentsWithTableStructure | null>(structuredClone(documentsResponsePayload))
    getWrapper(fakeFolder, documents)

    await nextTick()
    fakeFolder.value = null
    await nextTick()

    expect(onConnectedAsyncMock).not.toHaveBeenCalled()
  })
})
