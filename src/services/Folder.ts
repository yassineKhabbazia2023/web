/* eslint-disable max-len */
import { commonApi as api } from '@kpmg/common'
import type { Service } from '@/models/Service'
import type { Folder } from '@/models/Folder'

const tokenValue =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJFUTBNVVE1TjBOQ1JUSkVNemszTTBVMVJrTkRRMFUwUTBNMVJFRkJSamhETWpkRU5VRkJRZyJ9.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC8zX2JrblpQNTNsNzRRZ01QaExwMnJta2J1WTVHYnlpUS1PR19OMGc3bFRiSWpjZWZjem1MZ3prRkRJZlZNMzNpaEwvIiwiYXBpS2V5IjoiM19ia25aUDUzbDc0UWdNUGhMcDJybWtidVk1R2J5aVEtT0dfTjBnN2xUYklqY2VmY3ptTGd6a0ZESWZWTTMzaWhMIiwiaWF0IjoxNjk1MzcwMjkyLCJleHAiOjE2OTUzNzMyOTIsInJpc2tTY29yZSI6MC4wLCJzdWIiOiJlZmVmYjFjYTMwM2Q0MzVkYWI3MTcyMDBjMzU3MTNhZiIsInVzZXJuYW1lIjoidHVuaXNfdG1hMkB5b3BtYWlsLmNvbSIsImVtYWlsIjoidHVuaXNfdG1hMkB5b3BtYWlsLmNvbSIsImRhdGEuY29uc3RlbGxhdGlvbiI6eyJhbGxDb21wYW5pZXMiOlt7IklCUyI6IjEwMDAyNjUzMDgifSx7IklCUyI6ImU4ZmJiN2JkIn0seyJJQlMiOiIxMDAwNTg4NzAyIn0seyJJQlMiOiIxOTk5MDQ2MTQ4In0seyJJQlMiOiIxOTk5MTQ5NjAxIn0seyJJQlMiOiIxOTk5MTcxNzk1In1dLCJjaGFsbGVuZ2UiOiIxMDAwMjY1MzA4IiwiaWQiOiJjMzg4ZGJiZC1hYmIwLTRmNTEtODZhNy1iYmE5ZmJiZTFmOTUiLCJlbWFpbCI6InR1bmlzX3RtYTJAeW9wbWFpbC5jb20ifX0.cJ_gee-76VZXEnnY9IEX6fmI0UytC2MI_z1SFZFAXxi2nEwgBEPphXEjeETmLHfQM1PAqnWf7UxOzsXPsvDiQGAU4759sKNPTf1GJyNCEgyjWvfnh6ZUzrsMLI4Nwc77sUbCvXc-rwsqYWiEx4tWaspHOuEKewb1jYay-tEATzER513xTChGB7Uaf6dY_cpQwWQfnoJQhSbirtP5zixRIUoLXEafjB6vsBSs-4Rv-_LoBWpHiO9w0IaKDkLkU64NF2w-ZnNgBRU6sPMOBoJQfutGtTttRJasSjNfbEgQQ3Wu94yQrj0i7INBAmE7OE1qULQgQ21fdRNHq6-8FIKKBQ'
export const fetchServiceFolders = async (
  token: string,
  serviceId: Service['ServiceId'],
  entityId: string
): Promise<Folder[]> => {
  const fetchFolderUrl = `${serviceId}/${entityId}/folders`
  const apiObject = api().ds
  apiObject.defaults.headers.Authorization = token
  return (await apiObject.get(fetchFolderUrl)).data
}

export const fetchServicesFolders = async (
  token: string,
  services: Service[],
  entityId: string
): Promise<Folder[][]> => {
  const foldersByService: Folder[][] = []
  const apiObject = api().ds
  apiObject.defaults.headers.Authorization = token

  for (const s of services) {
    const serviceFolder = await fetchServiceFolders(
      token,
      s.ServiceId,
      entityId
    )
    foldersByService.push(serviceFolder)
  }

  return foldersByService
}

export const CreateFolder = async (
  token: string = '',
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  parentFolderId: Folder['id'],
  folderName: string
) => {
  const createFolderUrl = `${serviceId}/${entityId}/folders`
  const apiObject = api().ds
  apiObject.defaults.headers.Authorization = tokenValue
  console.log(token)
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
  apiObject.defaults.headers.Authorization = tokenValue
  return (
    await apiObject.patch(renameFolderUrl, [
      { op: 'replace', path: '/name', value: folderName }
    ])
  ).data
}

export const DeleteFolder = async (
  token: string = '',
  serviceId: Service['ServiceId'] | null,
  entityId: string,
  folderId: Folder['id'],
  keepFolder: boolean
) => {
  const deleteFolderUrl = `${serviceId}/${entityId}/folders/${folderId}?keepFolder=${keepFolder}`
  const apiObject = api().ds
  apiObject.defaults.headers.Authorization = tokenValue
  console.log(token)
  await apiObject.delete(deleteFolderUrl)
}
