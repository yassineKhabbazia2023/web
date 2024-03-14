import type { Ref } from 'vue'
import { watch, onMounted } from 'vue'
import { initializedAccountingDataStreamInstance } from '@/models/AccountingHubConnection'
import type { Folder } from '@/models/Folder'
import type {
  Document,
  DocumentsWithTableStructure,
  DocumentStatusUpdateResponse,
} from '@/models/Document'

export function usePiaStatusSync(
  selectedFolder: Ref<Folder | null>,
  documents: Ref<DocumentsWithTableStructure | null>,
) {
  // Changing the listened folder when on selected folder change
  watch(selectedFolder, (newSelectedFolderId, oldSelectedFolderId) => {
    initializedAccountingDataStreamInstance.then((instance) => {
      if (oldSelectedFolderId) {
        instance.OnDisconnectedAsync(oldSelectedFolderId.id)
      }

      if (newSelectedFolderId) {
        instance.OnConnectedAsync(newSelectedFolderId?.id)
      }
    })
  })

  onMounted(() => {
    initializedAccountingDataStreamInstance.then((instance) => {
      instance
        .getConnection()
        .on(
          'DocumentPiaStatusChanged',
          (response) => {
            if (!documents.value) return
            // folderId response is returned as number in data streams
            const document: DocumentStatusUpdateResponse = JSON.parse(response)
            updateDocumentSyncStatusAndPermissions(documents, document)
          },
        )
    })
  })

  function updateDocumentSyncStatusAndPermissions(
    documents: Ref<DocumentsWithTableStructure | null>,
    newDocumentStatusAndUpdate: DocumentStatusUpdateResponse,
  ) {
    if (!documents.value?.documentsPage.items) return
    const documentToUpdate: Document | undefined =
      documents.value.documentsPage.items.find(
        (d: Document) => d.id === String(newDocumentStatusAndUpdate.documentId),
      )

    if (!documentToUpdate) return
    documentToUpdate.piaStatus = newDocumentStatusAndUpdate.newStatus
    documentToUpdate.permissions = newDocumentStatusAndUpdate.permissions
  }

  return {
    updateDocumentSyncStatusAndPermissions,
    initializedAccountingDataStreamInstance,
  }
}
