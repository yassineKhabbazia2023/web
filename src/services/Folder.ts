/* eslint-disable max-len */
import { commonApi as api } from '@kpmg/common'
import type { Service } from '@/models/Service'
import type { Folder } from '@/models/Folder'

export const fetchServiceFolders = async (
  serviceId: Service['ServiceId'],
  entityId: string
): Promise<Folder[]> => {
  const fetchFolderUrl = `${serviceId}/${entityId}/folders`
  const apiObject = api().ds
  return (await apiObject.get(fetchFolderUrl)).data
}

export const fetchServicesFolders = async (
  services: Service[],
  entityId: string
): Promise<Folder[][]> => {
  const foldersByService: Folder[][] = []

  for (const s of services) {
    const serviceFolder = await fetchServiceFolders(
      s.ServiceId,
      entityId
    )
    foldersByService.push(serviceFolder)
  }

  return foldersByService
}

export const CreateFolder = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  parentFolderId: Folder['id'],
  folderName: string
) => {
  const createFolderUrl = `${serviceId}/${entityId}/folders`
  const apiObject = api().ds
  return (
    await apiObject.post(createFolderUrl, {
      parentId: parentFolderId,
      name: folderName
    })
  ).data
}
export const RenameFolder = async (
  folderId: Folder['id'],
  folderName: string,
  entityId: string,
  serviceId: null | Service['ServiceId']
) => {
  const renameFolderUrl = `${serviceId}/${entityId}/folders/${folderId}`
  const apiObject = api().ds
  return (
    await apiObject.patch(renameFolderUrl, [
      { op: 'replace', path: '/name', value: folderName }
    ])
  ).data
}

export const DeleteFolder = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  folderId: Folder['id'],
  keepFolder: boolean
) => {
  const deleteFolderUrl = `${serviceId}/${entityId}/folders/${folderId}?keepFolder=${keepFolder}`
  const apiObject = api().ds
  await apiObject.delete(deleteFolderUrl)
}
