import type { Folder } from '@ged/models/Folder'

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

export function getMockedButtonTest(folderName: string) {
  return [{
    typedValue: 'Test Content*',
    isBtnDisabled: true,
  }, {
    typedValue: '',
    isBtnDisabled: true,
  }, {
    typedValue: folderName,
    isBtnDisabled: true,
  }, {
    typedValue: 'New Folder',
    isBtnDisabled: false,
  }]
}
