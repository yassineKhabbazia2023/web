import { it, expect, describe, beforeEach } from 'vitest'
import {
  commonApiDsGetSpy,
  commonApiDsPostSpy,
  commonApiDsDeleteSpy,
  commonApiDsPatchSpy,
} from '@ged/__mocks__/common.import.mocks'
import { accountId } from '@ged/__mocks__/files.mocks'
import { loggerMock } from '@pulse/core/mocks'
import type { Service } from '@ged/models/Service'

import {
  fetchServiceFolders,
  CreateFolder,
  RenameFolder,
  deleteFolder,
  fetchServicesFolders,
  downloadFolder,
} from './Folder'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const fetchedFolder = 'fetched'
const patchedFolder = 'patched'

describe('folder service', () => {
  beforeEach(() => {
    commonApiDsGetSpy.mockResolvedValue({
      data: {
        folders: fetchedFolder,
      },
    })
    commonApiDsPatchSpy.mockResolvedValue({
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

    await fetchServicesFolders(services, entityId, accountId)

    expect(commonApiDsGetSpy).toHaveBeenCalledTimes(2)
  })

  it('should return array of services when fetchServicesFolder has error', async () => {
    const services = [
      { ServiceId: 'service-1', ServiceName: 'A' },
      { ServiceId: 'service-2', ServiceName: 'B' },
    ] as Service[]
    const entityId = 'my-entity'
    commonApiDsGetSpy.mockRejectedValue(services[0].ServiceId)
    const data = await fetchServicesFolders(services, entityId, accountId)

    expect(commonApiDsGetSpy).toHaveBeenCalledTimes(2)
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

    const data = await fetchServiceFolders(service, entityId, accountId)
    expect(commonApiDsGetSpy).toHaveBeenCalledOnce()
    expect(commonApiDsGetSpy).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders/currentuser',
      {
        headers: {
          'Account-Id': accountId,
        },
      },
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

    commonApiDsPostSpy.mockResolvedValue({
      data: {
        folders: createdFolder,
      },
    })

    const data = await CreateFolder(serviceId, entityId, parentFolderId, folderName, accountId)
    expect(commonApiDsPostSpy).toHaveBeenCalledTimes(1)
    expect(commonApiDsPostSpy).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders/currentuser', {
        name: 'newFolderName',
        parentId: 1,
      }, {
        headers: { 'Account-Id': accountId },
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

    const data = await RenameFolder(folderId, folderName, serviceId, accountId, entityId)
    expect(commonApiDsPatchSpy).toHaveBeenCalledTimes(1)
    expect(commonApiDsPatchSpy).toHaveBeenCalledWith(
      'some-entity-id/some-service-id/folders/1/currentuser',
      [{ op: 'replace', path: '/name', value: folderName }],
      {
        headers: { 'Account-Id': accountId },
      },
    )
    expect(data).toStrictEqual({
      folders: patchedFolder,
    })
  })

  it('should call ds api with the right uri and payload when DeleteFolder is called', async () => {
    const folderId = 1
    const serviceId = 'some-service-id'
    const entityId = 'some-entity-id'

    await deleteFolder(serviceId, entityId, folderId, false, accountId)
    expect(commonApiDsDeleteSpy).toHaveBeenCalledTimes(1)
    expect(commonApiDsDeleteSpy).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders/currentuser/1?keepFolder=false',
      {
        headers: { 'Account-Id': accountId },
      },
    )
  })

  it('should download the folder  when downloadFolder method is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }
    const folderId = 1
    const entityId = 'my-entity'

    await downloadFolder(service.ServiceId, entityId, folderId, accountId)

    expect(commonApiDsGetSpy).toHaveBeenCalledOnce()
    expect(commonApiDsGetSpy).toHaveBeenCalledWith(
      'service-1/my-entity/folders/1/archive',
      {
        headers: { 'Account-Id': accountId },
        responseType: 'blob',
      },
    )
  })
})
