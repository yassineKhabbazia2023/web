import type { Mock } from 'vitest'
import { foldersData } from './tree-folders.mocks'
import { servicesDataMock } from './services.mocks'
import { Service } from '@ged/models/Service'

export const fetchServicesFoldersSuccessMock: Mock = vi.fn(() => ({
  foldersByService: foldersData,
  unavailableServices: [] as Service[],
}))

export const fetchServicesFoldersFailMock: Mock = vi.fn(() => ({
  foldersByService: foldersData,
  unavailableServices: [servicesDataMock[0]],
}))

export const moveFolderAsyncFailMock: Mock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const createFolderFailMock: Mock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const deleteFolderFailMock: Mock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const renameFolderFailMock: Mock = vi.fn(() => {
  throw new Error('Something uncool')
})

export const tokenValueMock = 'mocked token'

export const folderServiceMock: Record<string, Mock | string> = {
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
