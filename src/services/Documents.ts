import { commonApi as api } from '@kpmg/common'
import type { Document, DocumentsWithTableStructure } from '@/models/Document'
import type { Service } from '@/models/Service'
import type { Folder } from '@/models/Folder'

export const fetchFolderDocuments = async (
  serviceId: Service['ServiceId'],
  folderId: Folder['id'],
  accountId: string,
  start = 0,
  limit = 10,
  sort = '-created'
): Promise<DocumentsWithTableStructure> => {
  const fetchFolderDocumentsUrl = `${serviceId}/${accountId}/documents/folder/${folderId}`
  const apiObject = api().ds

  return (
    await apiObject.get(fetchFolderDocumentsUrl, {
      params: {
        start,
        limit,
        sort
      }
    })
  ).data
}

export const downloadDocument = async (
  serviceId: Service['ServiceId'],
  accountId: string,
  documentId: Document['id']
): Promise<void> => {
  const downloadDocumentUrl = `${serviceId}/${accountId}/documents/${documentId}/content`
  const apiObject = api().ds

  return (await apiObject.get(downloadDocumentUrl, {
    responseType: 'blob'
  })).data

}

export const downloadDocuments = async (
  serviceId: Service['ServiceId'],
  accountId: string,
  documentsIds: Document['id'][]
): Promise<void> => {
  const downloadDocumentsUrl = `${serviceId}/${accountId}/archive`
  const apiObject = api().ds

  return (await apiObject.post(
    downloadDocumentsUrl,
    { ids: documentsIds },
    {
      responseType: 'blob'
    }
  )).data
}

export const deleteDocuments = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  documentIds: string[]
) => {
  const deleteFolderUrl = `${serviceId}/${entityId}/documents`
  const apiObject = api().ds
  await apiObject.delete(deleteFolderUrl, { data: { ids: documentIds } })
}
