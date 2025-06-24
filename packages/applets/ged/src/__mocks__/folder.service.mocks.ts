import { foldersData } from './tree-folders.mocks'
import { servicesDataMock } from './services.mocks'
import { Service } from '@ged/models/Service'

export const fetchServicesFoldersSuccessMock = vi.fn(() => ({
  foldersByService: foldersData,
  unavailableServices: [] as Service[],
}))

export const fetchServicesFoldersFailMock = vi.fn(() => ({
  foldersByService: foldersData,
  unavailableServices: [servicesDataMock[0]],
}))

export const moveFolderAsyncFailMock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const createFolderFailMock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const deleteFolderFailMock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const renameFolderFailMock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const tokenValueMock = 'mocked token'

export const folderServiceMock = {
  tokenValue: tokenValueMock,
  fetchServicesFolders: vi.fn(),
  fetchServicesFoldersSuccess: vi.fn(),
  fetchServicesFoldersFail: vi.fn(),
  downloadFolder: vi.fn(),
  moveFolderAsync: vi.fn(),
  CreateFolder: vi.fn(),
  deleteFolder: vi.fn(),
  RenameFolder: vi.fn(),
}
