import {
  apiGatewayGetMock,
  apiGatewayPostMock,
  apiGatewayDeleteMock,
  apiGatewayPatchMock,
} from '@pulse/common/mocks/vitest'
import { accountId } from '@ged/__mocks__/files.mocks'
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

const fetchedFolder = 'fetched'
const patchedFolder = 'patched'

describe('folder service', () => {
  beforeEach(() => {
    apiGatewayGetMock.mockResolvedValue({
      data: {
        folders: fetchedFolder,
      },
    })
    apiGatewayPatchMock.mockResolvedValue({
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

    expect(apiGatewayGetMock).toHaveBeenCalledTimes(2)
  })

  it('should return array of services when fetchServicesFolder has error', async () => {
    const services = [
      { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false },
      { ServiceId: 'service-2', ServiceName: 'B', IsReadOnly: false },
    ] as Service[]
    const entityId = 'my-entity'

    apiGatewayGetMock.mockRejectedValue(services[0].ServiceId)
    const data = await fetchServicesFolders(services, entityId, accountId)

    expect(apiGatewayGetMock).toHaveBeenCalledTimes(2)
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
    expect(apiGatewayGetMock).toHaveBeenCalledExactlyOnceWith(
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

    apiGatewayPostMock.mockResolvedValue({
      data: {
        folders: createdFolder,
      },
    })

    const data = await CreateFolder(serviceId, entityId, parentFolderId, folderName, accountId)
    expect(apiGatewayPostMock).toHaveBeenCalledTimes(1)
    expect(apiGatewayPostMock).toHaveBeenCalledWith(
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
    expect(apiGatewayPatchMock).toHaveBeenCalledTimes(1)
    expect(apiGatewayPatchMock).toHaveBeenCalledWith(
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
    expect(apiGatewayDeleteMock).toHaveBeenCalledTimes(1)
    expect(apiGatewayDeleteMock).toHaveBeenCalledWith(
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

    expect(apiGatewayGetMock).toHaveBeenCalledExactlyOnceWith(
      `${API_PREFIXES.GED}/${service.ServiceId}/${entityId}/folders/${folderId}/archive`,
      {
        headers: { 'Account-Id': accountId },
        responseType: 'blob',
      },
    )
  })
})
