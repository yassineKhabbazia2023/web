import { canCreateFolder } from './folderPermissionsHelper'
import { describe, it, expect } from 'vitest'
import type { Folder, FolderProperties } from '@ged/models/Folder'
const entryData: Folder = {
  id: 1,
  children: [
    {
      id: 2,
      children: [{} as Folder],
      name: 'TheFolder',
      parent: { id: 1 },
      permissions: [],
      properties: {} as FolderProperties,
      serviceId: 'some-service',
    } as Folder,
  ],
  name: 'A',
  parent: { id: 0 },
  permissions: ['CAN_CREATE_FOLDER'],
  properties: {} as FolderProperties,
  serviceId: 'some-service',
} as Folder
describe('folderPermissionsHelper', () => {
  it('should check if folder has create permission', () => {
    const canCreate = canCreateFolder(entryData)
    expect(canCreate).toBeTruthy()
  })
})
