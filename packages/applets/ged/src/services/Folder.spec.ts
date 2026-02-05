import { it, expect, describe, beforeEach } from 'vitest'
import {
  commonApiGatewayGetSpy,
  commonApiGatewayPostSpy,
  commonApiGatewayDeleteSpy,
  commonApiGatewayPatchSpy,
} from '@ged/__mocks__/common.import.mocks'
import { accountId } from '@ged/__mocks__/files.mocks'
import { loggerMock } from '@pulse/toolbox/mocks'
import type { Service } from '@ged/models/Service'
import { API_PREFIXES } from '@pulse/common/constants'

import {
  fetchServiceFolders,
  CreateFolder,
  RenameFolder,
  deleteFolder,
  fetchServicesFolders,
  downloadFolder,
} from './Folder'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const fetchedFolder = 'fetched'
const patchedFolder = 'patched'

describe('folder service', () => {
  beforeEach(() => {
    commonApiGatewayGetSpy.mockResolvedValue({
      data: {
        folders: fetchedFolder,
      },
    })
    commonApiGatewayPatchSpy.mockResolvedValue({
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

    expect(commonApiGatewayGetSpy).toHaveBeenCalledTimes(2)
  })

  it('should return array of services when fetchServicesFolder has error', async () => {
    const services = [
      { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false },
      { ServiceId: 'service-2', ServiceName: 'B', IsReadOnly: false },
    ] as Service[]
    const entityId = 'my-entity'

    commonApiGatewayGetSpy.mockRejectedValue(services[0].ServiceId)
    const data = await fetchServicesFolders(services, entityId, accountId)

    expect(commonApiGatewayGetSpy).toHaveBeenCalledTimes(2)
    expect(data).toStrictEqual({
      foldersByService: [],
      unavailableServices: [services[0], services[1]],
    })
  })

  it('should call ds api with the right uri when fetchServiceFolders is called', async () => {
    const service = {
      ServiceId: 'some-service-id',
      ServiceName: 'some service name',
      IsReadOnly: false,
    }
    const entityId = 'some-entity-id'

    const data = await fetchServiceFolders(service, entityId, accountId)
    expect(commonApiGatewayGetSpy).toHaveBeenCalledExactlyOnceWith(
      `${API_PREFIXES.GED}/${service.ServiceId}/${entityId}/folders/currentuser`,
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

    commonApiGatewayPostSpy.mockResolvedValue({
      data: {
        folders: createdFolder,
      },
    })

    const data = await CreateFolder(serviceId, entityId, parentFolderId, folderName, accountId)
    expect(commonApiGatewayPostSpy).toHaveBeenCalledTimes(1)
    expect(commonApiGatewayPostSpy).toHaveBeenCalledWith(
      `${API_PREFIXES.GED}/${serviceId}/${entityId}/folders/currentuser`,
      {
        name: 'newFolderName',
        parentId: 1,
      },
      {
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
    expect(commonApiGatewayPatchSpy).toHaveBeenCalledTimes(1)
    expect(commonApiGatewayPatchSpy).toHaveBeenCalledWith(
      `${API_PREFIXES.GED}/some-entity-id/some-service-id/folders/1/currentuser`,
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
    expect(commonApiGatewayDeleteSpy).toHaveBeenCalledTimes(1)
    expect(commonApiGatewayDeleteSpy).toHaveBeenCalledWith(
      `${API_PREFIXES.GED}/${serviceId}/${entityId}/folders/currentuser/${folderId}?keepFolder=false`,
      {
        headers: { 'Account-Id': accountId },
      },
    )
  })

  it('should download the folder  when downloadFolder method is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false }
    const folderId = 1
    const entityId = 'my-entity'

    await downloadFolder(service.ServiceId, entityId, folderId, accountId)

    expect(commonApiGatewayGetSpy).toHaveBeenCalledExactlyOnceWith(
      `${API_PREFIXES.GED}/${service.ServiceId}/${entityId}/folders/${folderId}/archive`,
      {
        headers: { 'Account-Id': accountId },
        responseType: 'blob',
      },
    )
  })
})
