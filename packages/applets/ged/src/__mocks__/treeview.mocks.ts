import type { Folder } from '@ged/models/Folder'
import { GedServiceId } from '@ged/enums/ged.enum'

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
    serviceId: GedServiceId.ACCOUNTING,
  }

  return {
    ...defaultFolder,
    ...override,
  }
}

// `label` names each case for the it.each titles: the folderName case carries a
// several-hundred-character value that would otherwise be dumped into the title.
export function getMockedButtonTest(folderName: string) {
  return [{
    label: 'a name holding a forbidden character',
    typedValue: 'Test Content*',
    isBtnDisabled: true,
  }, {
    label: 'an empty name',
    typedValue: '',
    isBtnDisabled: true,
  }, {
    label: 'a name exceeding the allowed length',
    typedValue: folderName,
    isBtnDisabled: true,
  }, {
    label: 'a valid name',
    typedValue: 'New Folder',
    isBtnDisabled: false,
  }]
}
