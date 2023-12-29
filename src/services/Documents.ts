import { commonApi as api } from '@kpmg/common'
import type { Document, DocumentsWithTableStructure } from '@/models/Document'
import type { Service } from '@/models/Service'
import type { Folder } from '@/models/Folder'
import { MoveDocumentsRequest } from
  '@/modules/Documents/components/DocumentsMove/DocumentsMoveTypes'

export const fetchFolderDocuments = async (
  serviceId: Service['ServiceId'],
  folderId: Folder['id'],
  entityId: string,
  skip = 0,
  limit = 10,
  sort = '-created'
): Promise<DocumentsWithTableStructure> => {
  const fetchFolderDocumentsUrl = `${serviceId}/${entityId}/documents/folder/${folderId}`
  const apiObject = api().ds

  return (
    await apiObject.get(fetchFolderDocumentsUrl, {
      params: {
        skip,
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

export const renameDocument = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  documentId: Document['id'],
  newDocumentName: string
): Promise<void> => {
  const renameDocumentUrl = `${serviceId}/${entityId}/documents/${documentId}`
  const requestBody = [{
    op: 'replace',
    path: '/name',
    value: newDocumentName
  }]
  return await api().ds.patch(renameDocumentUrl, requestBody)
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

export const uploadDocument = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  file: File,
  folderId: number
): Promise<Document> => {
  const formData = new FormData()
  formData.append('file', file)
  const apiObject = api().ds

  return await apiObject.post(
    `${serviceId}/${entityId}/folders/${folderId}/documents?notify=true&source=User`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

export const moveDocuments = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  fileMove: MoveDocumentsRequest
): Promise<void> => {
  const apiObject = api().ds
  return await apiObject.post(
    `${serviceId}/${entityId}/documents/move`,
    JSON.stringify(fileMove),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export const transmitDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  documentsIds: string[]
): Promise<void> => {
  const apiObject = api().ds
  return await apiObject.post(
    `${serviceId}/${entityId}/documents/pia-speedup-transfer`,
    { ids: documentsIds },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export const previewDocument = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  documentId: Document['id']
): Promise<{ data: any; headers: any }> => {
  const apiObject = api().ds
  return await apiObject.get(
    `${serviceId}/${entityId}/documents/${documentId}/preview`,
    {
      responseType: 'arraybuffer'
    }
  )
}

