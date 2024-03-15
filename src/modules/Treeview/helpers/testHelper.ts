import type { Folder } from '@/models/Folder'

export function getMockedFolder(
  parentId: number,
  id = 1111111111,
  name = 'NewFolder',
  override: Partial<Folder> = {},
): Folder {
  const defaultFolder = {
    id,
    children: [],
    name,
    parent: {
      id: parentId,
    },
    permissions: [],
    properties: {
      syncStatus: '',
      folderDescription: '',
      tracingName: '',
    },
    serviceId: 'service-id-compta',
  }

  return {
    ...defaultFolder,
    ...override,
  }
}
