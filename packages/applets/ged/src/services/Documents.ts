import { commonApi as api } from '@pulse/common'
import type { AxiosResponse } from 'axios'
import type { Document, DocumentsWithTableStructure } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'
import type { Folder } from '@ged/models/Folder'
import type { MoveDocumentsRequest } from
  '@ged/modules/Documents/components/DocumentsMove/DocumentsMoveTypes'
import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'

export const fetchFolderDocuments = async (
  serviceId: Service['ServiceId'],
  folderId: Folder['id'],
  entityId: string,
  accountId: number,
  skip = 0,
  limit = 10,
  sort = '-created',
  filters: DocumentSearchFilters | null = null,
): Promise<DocumentsWithTableStructure> => {
  const fetchFolderDocumentsUrl = `${serviceId}/${entityId}/documents/folder/${folderId}/currentuser`
  const apiObject = api().ds

  return (
    await apiObject.get(fetchFolderDocumentsUrl, {
      headers: { 'Account-Id': accountId },
      params: {
        skip,
        limit,
        sort,
        createdStart: filters?.startDate ?? null,
        createdEnd: filters?.endDate ?? null,
      },
    })
  ).data
}

export const downloadDocument = async (
  serviceId: Service['ServiceId'],
  accountNumber: string,
  documentId: Document['id'],
  accountId: number,
): Promise<Blob> => {
  const downloadDocumentUrl = `${serviceId}/${accountNumber}/documents/${documentId}/content`
  const apiObject = api().ds

  return (await apiObject.get(downloadDocumentUrl, {
    headers: { 'Account-Id': accountId },
    responseType: 'blob',
  })).data
}

export const downloadDocuments = async (
  serviceId: Service['ServiceId'],
  accountNumber: string,
  documentsIds: Document['id'][],
  accountId: number,
): Promise<void> => {
  const downloadDocumentsUrl = `${serviceId}/${accountNumber}/archive`
  const apiObject = api().ds

  return (await apiObject.post(
    downloadDocumentsUrl,
    { ids: documentsIds },
    {
      headers: { 'Account-Id': accountId },
      responseType: 'blob',
    },
  )).data
}

export const renameDocument = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  documentId: Document['id'],
  newDocumentName: string,
  accountId: number,
): Promise<void> => {
  const renameDocumentUrl = `${serviceId}/${entityId}/documents/${documentId}`
  const requestBody = [{
    op: 'replace',
    path: '/name',
    value: newDocumentName,
  }]
  return await api().ds.patch(renameDocumentUrl, requestBody, {
    headers: { 'Account-Id': accountId },
  })
}

export const deleteDocuments = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  documentIds: string[],
  accountId: number,
) => {
  const deleteFolderUrl = `${serviceId}/${entityId}/documents`
  const apiObject = api().ds
  await apiObject.delete(deleteFolderUrl, {
    headers: { 'Account-Id': accountId },
    data: { ids: documentIds } })
}

export const uploadDocument = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  file: File,
  folderId: number,
  accountId: number,
): Promise<Document> => {
  const formData = new FormData()
  formData.append('file', file)
  const apiObject = api().ds

  return await apiObject.post(
    `${serviceId}/${entityId}/folders/${folderId}/currentuser/documents?notify=true&source=User`,
    formData,
    {
      headers: {
        'Account-Id': accountId,
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

export const moveDocuments = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  fileMove: MoveDocumentsRequest,
  accountId: number,
): Promise<void> => {
  const apiObject = api().ds
  return await apiObject.post(
    `${serviceId}/${entityId}/documents/move`,
    JSON.stringify(fileMove),
    {
      headers: {
        'Account-Id': accountId,
        'Content-Type': 'application/json',
      },
    },
  )
}

export const transmitDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  documentsIds: string[],
  accountId: number,
): Promise<void> => {
  const apiObject = api().ds
  return await apiObject.post(
    `${serviceId}/${entityId}/documents/pia-speedup-transfer`,
    { ids: documentsIds },
    {
      headers: {
        'Account-Id': accountId,
        'Content-Type': 'application/json',
      },
    },
  )
}
export interface DocumentPreviewResponse {
  data: ArrayBuffer
  headers: { [key: string]: string }
}

export const previewDocument = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  documentId: Document['id'],
  accountId: number,
): Promise<DocumentPreviewResponse> => {
  const apiObject = api().ds
  const response: AxiosResponse<ArrayBuffer> = await apiObject.get(
    `${serviceId}/${entityId}/documents/${documentId}/preview`,
    {
      responseType: 'arraybuffer',
      headers: { 'Account-Id': accountId },
    },
  )
  const headers: { [key: string]: string } = {}
  if (response.headers) {
    for (const [header, value] of Object.entries(response.headers)) {
      headers[header] = value as string
    }
  }

  return {
    data: response.data,
    headers,
  }
}

export const fetchDocumentsByKeyWord = async (
  serviceId: Service['ServiceId'],
  folderId: Folder['id'],
  entityId: string,
  accountId: number,
  skip: number,
  limit: number,
  sort: string,
  search: string,
  findInChildFolders = true,
): Promise<DocumentsWithTableStructure> => {
  const fetchFolderDocumentsUrl = `${serviceId}/${entityId}/documents/folder/${folderId}/currentuser`
  const apiObject = api().ds

  return (
    await apiObject.get(fetchFolderDocumentsUrl, {
      headers: { 'Account-Id': accountId },
      params: {
        skip,
        limit,
        sort,
        search,
        findInChildFolders,
      },
    })
  ).data
}
