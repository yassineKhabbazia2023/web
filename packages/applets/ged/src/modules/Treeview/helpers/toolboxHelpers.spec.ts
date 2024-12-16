
import { foldersMappingRecord } from '@ged/modules/common/data/toolboxPermissionsMapping'
import { generateToolboxBasicData } from '@ged/modules/common/helpers/toolboxHelper'
import { describe, it, expect } from 'vitest'

describe('toolboxHelpers', () => {
  const {
    CAN_CREATE_FOLDER,
    CAN_DOWNLOAD_FOLDER,
    CAN_DELETE_FOLDER,
    CAN_RENAME_FOLDER,
  } = foldersMappingRecord
  it('should return correct mapping when passing permission array', () => {
    const res = generateToolboxBasicData('Folders',
      ['CAN_CREATE_FOLDER', 'test', 'CAN_DELETE_FOLDER'])

    const expectedRes = [
      CAN_CREATE_FOLDER.toolboxLine,
      CAN_DOWNLOAD_FOLDER.toolboxLine,
      CAN_DELETE_FOLDER.toolboxLine,
    ]

    expect(res).toStrictEqual(expectedRes)
  })

  it('should return correct mapping when passing permission array (2)', () => {
    const res = generateToolboxBasicData('Folders', [
      'CAN_RENAME_FOLDER',
      'CAN_CREATE_FOLDER',
    ])

    const expectedRes = [
      CAN_CREATE_FOLDER.toolboxLine,
      CAN_RENAME_FOLDER.toolboxLine,
      CAN_DOWNLOAD_FOLDER.toolboxLine,
    ]

    expect(res).toStrictEqual(expectedRes)
  })
})
