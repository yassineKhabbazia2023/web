import { commonApi as api } from '@kpmg/common'
import type { DocumentsWithTableStructure } from '@/models/Document'
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
