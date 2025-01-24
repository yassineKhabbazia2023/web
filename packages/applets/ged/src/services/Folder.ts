import { logger } from '@pulse/core'
import { commonApi } from '@pulse/common'
import type { Service } from '@ged/models/Service'
import type { Folder } from '@ged/models/Folder'

export const fetchServiceFolders = async (
  service: Service,
  entityId: string,
): Promise<Folder[]> => {
  const fetchFolderUrl = `${service.ServiceId}/${entityId}/folders/currentuser`
  try {
    const response = await commonApi().ds.get(fetchFolderUrl)
    return response?.data
  } catch (error) {
    logger.error(error)
    // We return the serviceId that failed in order to handle errors in a specific way
    // as "Comptabilité" service might work but "Gestion Sociale" might fail
    return Promise.reject(service)
  }
}

type fetchServicesFoldersReturnType = {
  foldersByService: Folder[][]
  unavailableServices: Service[]
}
export const fetchServicesFolders = async (
  services: Service[],
  entityId: string,
): Promise<fetchServicesFoldersReturnType> => {
  const foldersByService: Folder[][] = []
  const unavailableServices: Service[] = []

  const servicesFolderPromises = services.map((service) => {
    return fetchServiceFolders(service, entityId)
  })

  const settledServicesFoldersPromises = await Promise.allSettled(servicesFolderPromises)

  settledServicesFoldersPromises.forEach(promise => {
    if (promise.status === 'fulfilled') {
      foldersByService.push(promise.value)
    } else if (promise.status === 'rejected') {
      unavailableServices.push(promise.reason as Service)
    }
  })

  return { foldersByService, unavailableServices }
}

export const CreateFolder = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  parentFolderId: Folder['id'],
  folderName: string,
) => {
  const createFolderUrl = `${serviceId}/${entityId}/folders/currentuser`
  const response = await commonApi().ds.post(createFolderUrl, {
    parentId: parentFolderId,
    name: folderName,
  })

  return response?.data
}
export const RenameFolder = async (
  folderId: Folder['id'],
  folderName: string,
  entityId: string,
  serviceId: null | Service['ServiceId'],
) => {
  const renameFolderUrl = `${serviceId}/${entityId}/folders/${folderId}/currentuser`
  const response = await commonApi().ds.patch(renameFolderUrl, [
    { op: 'replace', path: '/name', value: folderName },
  ])

  return response.data
}

export const deleteFolder = async (
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  folderId: Folder['id'],
  keepFolder: boolean,
) => {
  const deleteFolderUrl = `${serviceId}/${entityId}/folders/currentuser/${folderId}?keepFolder=${keepFolder}`

  await commonApi().ds.delete(deleteFolderUrl)
}

export const downloadFolder = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  folderId: Folder['id'],
) : Promise<void> => {
  const downloadFolderUrl = `${serviceId}/${entityId}/folders/${folderId}/archive`
  const response = await commonApi().ds.get(
    downloadFolderUrl,
    {
      responseType: 'blob',
    },
  )

  return response.data
}

export const moveFolderAsync = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  folderId: Folder['id'],
  destinationFolderId: Folder['id'],
): Promise<void> => {
  const moveFolderUrl = `${serviceId}/${entityId}/folders/${folderId}/currentuser`
  const apiObject = commonApi().ds
  return (
    await apiObject.patch(moveFolderUrl, [
      { op: 'replace', path: '/parent/id', value: destinationFolderId.toString() },
    ])
  ).data
}
