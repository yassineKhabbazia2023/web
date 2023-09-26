import { it, expect, vi, describe } from 'vitest'
import {
  fetchServiceFolders,
  CreateFolder,
  RenameFolder,
  DeleteFolder,
  fetchServicesFolders
} from './Folder'
import type { Service } from '@/models/Service'

const mockDsGet = vi.fn(() => {
  return Promise.resolve({
    data: {
      folders: 'fetched'
    }
  })
})

const mockDsPost = vi.fn(() => {
  return Promise.resolve({
    data: {
      folders: 'new folder'
    }
  })
})

const mockDsPatch = vi.fn(() => {
  return Promise.resolve({
    data: {
      folders: 'updated'
    }
  })
})

const mockDsDelete = vi.fn(() => {
  return Promise.resolve({
    data: {
      folders: 'deleted'
    }
  })
})

const headersMock = {
  defaults: {
    headers: {
      Authorization: ''
    }
  }
}
vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: {
      defaults: headersMock.defaults,
      get: mockDsGet,
      post: mockDsPost,
      patch: mockDsPatch,
      delete: mockDsDelete
    }
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))

describe('folder service', () => {
  it('should call fetchServiceFolders when fetchServicesFolders is called ', async () => {
    const token = ''
    const services = [
      { ServiceId: 'service-1', ServiceName: 'A' },
      { ServiceId: 'service-2', ServiceName: 'B' }
    ] as Service[]
    const entityId = 'my-entity'

    await fetchServicesFolders(token, services, entityId)

    expect(mockDsGet).toHaveBeenCalledTimes(2)
  })
  it('should call ds api with the right uri when fetchServiceFolders is called', async () => {
    const token = 'some-token-fetsh-folders'
    const serviceId = 'some-service-id'
    const entityId = 'some-entity-id'

    const data = await fetchServiceFolders(token, serviceId, entityId)
    expect(mockDsGet).toHaveBeenCalledTimes(1)
    expect(mockDsGet).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders'
    )
    expect(headersMock.defaults.headers.Authorization).toStrictEqual(token)
    expect(data).toStrictEqual({
      folders: 'fetched'
    })
  })

  it('should call ds api with the right uri and payload when CreateFolder is called', async () => {
    const token = ''
    const serviceId = 'some-service-id'
    const entityId = 'some-entity-id'
    const parentFolderId = 1
    const folderName = 'newFolderName'

    const data = await CreateFolder(token, serviceId, entityId, parentFolderId, folderName)
    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders', {
        name: 'newFolderName',
        parentId: 1
      }
    )
    expect(data).toStrictEqual({
      folders: 'new folder'
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
      'some-entity-id/some-service-id/folders/1',
      [{ op: 'replace', path: '/name', value: folderName }]
    )
    expect(data).toStrictEqual({
      folders: 'updated'
    })
  })

  it('should call ds api with the right uri and payload when DeleteFolder is called', async () => {
    const folderId = 1
    const serviceId = 'some-service-id'
    const entityId = 'some-entity-id'

    await DeleteFolder('', serviceId, entityId, folderId, false)
    expect(mockDsDelete).toHaveBeenCalledTimes(1)
    expect(mockDsDelete).toHaveBeenCalledWith(
      'some-service-id/some-entity-id/folders/1?keepFolder=false'
    )
  })

})

