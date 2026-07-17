import { foldersMappingRecord } from '@ged/modules/common/data/toolboxPermissionsMapping'


import { generateToolboxBasicData } from './toolboxHelper'

describe('toolbox helper', () => {
  const {
    CAN_CREATE_FOLDER,
    CAN_DOWNLOAD_FOLDER,
    CAN_DELETE_FOLDER,
    CAN_RENAME_FOLDER,
  } = foldersMappingRecord

  describe('should return the proper toolbox line based on permissions and target', () => {
    const cases = [
      {
        target: 'Folders',
        permissions: ['CAN_DELETE_FOLDER', 'CAN_RENAME_FOLDER'],
        expectedResult: [
          {
            pIconName: 'inputCursorText',
            pValue: 'Renommer dossier',
            pActionName: 'toolbox-rename-action-click',
          },
          {
            pIconName: 'download',
            pValue: 'Télécharger',
            pActionName: 'toolbox-download-action-click',
          },
          {
            pIconName: 'trash',
            pValue: 'Supprimer',
            pActionName: 'toolbox-delete-action-click',
          },
        ],
      },
      {
        target: 'Documents',
        permissions: [
          'CAN_DELETE_DOCUMENT',
          'CAN_RENAME_DOCUMENT',
          'CAN_GO_TO_DOCUMENT',
        ],
        expectedResult: [
          {
            pIconName: 'inputCursorText',
            pValue: 'Renommer',
            pActionName: 'rename-document',
          },
          {
            pIconName: 'download',
            pValue: 'Télécharger',
            pActionName: 'download-document',
          },
          {
            pIconName: 'arrowBarRight',
            pValue: 'Accéder au dossier',
            pActionName: 'go-to-document',
          },
          {
            pIconName: 'trash',
            pValue: 'Supprimer',
            pActionName: 'delete-document',
          },

        ],
      },
    ]

    it.each(cases)(
      'pText mapping validation',
      ({ target, permissions, expectedResult }) => {
        const result = generateToolboxBasicData(target, permissions)
        expect(result).toStrictEqual(expectedResult)
      },
    )
  })


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
