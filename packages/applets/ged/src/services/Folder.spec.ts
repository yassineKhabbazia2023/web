import { it, expect, describe, beforeEach } from 'vitest'
import {
  fetchServiceFolders,
  CreateFolder,
  RenameFolder,
  deleteFolder,
  fetchServicesFolders,
  downloadFolder,
} from './Folder'
import type { Service } from '@ged/models/Service'
import {
  commonApiDsGetSpy as mockDsGet,
  commonApiDsPostSpy as mockDsPost,
  commonApiDsDeleteSpy as mockDsDelete,
  commonApiDsPatchSpy as mockDsPatch,
} from '@ged/../vitest.setup'

const fetchedFolder = 'fetched'
const patchedFolder = 'patched'

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

describe('folder service', () => {
  beforeEach(() => {
    mockDsGet.mockResolvedValue({
      data: {
        folders: fetchedFolder,
      },
    })
    mockDsPatch.mockResolvedValue({
      data: {
        folders: patchedFolder,
      },
    })
  })
  it('should call fetchServiceFolders when fetchServicesFolders is called', async () => {
    const services = [
      { ServiceId: 'service-1', ServiceName: 'A' },
      { ServiceId: 'service-2', ServiceName: 'B' },
    ] as Service[]
    const entityId = 'my-entity'

    await fetchServicesFolders(services, entityId)

    expect(mockDsGet).toHaveBeenCalledTimes(2)
  })

  it('should return array of services when fetchServicesFolder has error', async () => {
    const services = [
      { ServiceId: 'service-1', ServiceName: 'A' },
      { ServiceId: 'service-2', ServiceName: 'B' },
    ] as Service[]
    const entityId = 'my-entity'
    mockDsGet.mockRejectedValue(services[0].ServiceId)
    const data = await fetchServicesFolders(services, entityId)

    expect(mockDsGet).toHaveBeenCalledTimes(2)
    expect(data).toStrictEqual({
      foldersByService: [],
      unavailableServices: [services[0], services[1]],
    })
  })
  it('should call ds api with the right uri when fetchServiceFolders is called', async () => {
    const service = {
      ServiceId: 'some-service-id',
      ServiceName: 'some service name',
    }
    const entityId = 'some-entity-id'

    const data = await fetchServiceFolders(service, entityId)
    expect(mockDsGet).toHaveBeenCalledOnce()
    expect(mockDsGet).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders/currentuser',
    )
    expect(data).toStrictEqual({
      folders: fetchedFolder,
    })
  })

  it('should call ds api with the right uri and payload when CreateFolder is called', async () => {
    const serviceId = 'some-service-id'
    const entityId = 'some-entity-id'
    const parentFolderId = 1
    const folderName = 'newFolderName'
    const createdFolder = 'new folder'

    mockDsPost.mockResolvedValue({
      data: {
        folders: createdFolder,
      },
    })

    const data = await CreateFolder(serviceId, entityId, parentFolderId, folderName)
    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders/currentuser', {
        name: 'newFolderName',
        parentId: 1,
      },
    )
    expect(data).toStrictEqual({
      folders: createdFolder,
    })
  })

  it('should call ds api with the right uri and payload when RenameFolder is called', async () => {
    const folderId = 1
    const serviceId = 'some-service-id'
    const entityId = 'some-entity-id'
    const folderName = 'newFolderName'

    const data = await RenameFolder(folderId, folderName, serviceId, entityId)
    expect(mockDsPatch).toHaveBeenCalledTimes(1)
    expect(mockDsPatch).toHaveBeenCalledWith(
      'some-entity-id/some-service-id/folders/1/currentuser',
      [{ op: 'replace', path: '/name', value: folderName }],
    )
    expect(data).toStrictEqual({
      folders: patchedFolder,
    })
  })

  it('should call ds api with the right uri and payload when DeleteFolder is called', async () => {
    const folderId = 1
    const serviceId = 'some-service-id'
    const entityId = 'some-entity-id'

    await deleteFolder(serviceId, entityId, folderId, false)
    expect(mockDsDelete).toHaveBeenCalledTimes(1)
    expect(mockDsDelete).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders/currentuser/1?keepFolder=false',
    )
  })

  it('should download the folder  when downloadFolder method is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }
    const folderId = 1
    const accountId = 'my-account-id'

    await downloadFolder(service.ServiceId, accountId, folderId)

    expect(mockDsGet).toHaveBeenCalledOnce()
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/folders/1/archive',
      {
        responseType: 'blob',
      },
    )
  })
})
