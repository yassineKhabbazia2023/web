import { generateToolboxBasicData } from '@/modules/common/helpers/toolboxHelper'
import { describe, it, expect } from 'vitest'

describe('toolboxHelpers', () => {
  it('should return correct mapping when passing permission array', () => {
    const res = generateToolboxBasicData('Folders',
      ['CAN_CREATE_FOLDER', 'test', 'CAN_DELETE_FOLDER'])

    const expectedRes = [
      {
        pIconName: 'PIFolderPlus',
        pValue: 'Nouveau dossier',
        pActionName: 'toolbox-create-action-click'
      },
      {
        pIconName: 'PIDownload',
        pValue: 'Télécharger',
        pActionName: 'toolbox-download-action-click'

      },
      {
        pIconName: 'PITrash',
        pValue: 'Supprimer',
        pActionName: 'toolbox-delete-action-click'
      }
    ]

    expect(res).toStrictEqual(expectedRes)
  })

  it('should return correct mapping when passing permission array', () => {
    const res = generateToolboxBasicData('Folders', [
      'CAN_RENAME_FOLDER',
      'CAN_CREATE_FOLDER'
    ])

    const expectedRes = [
      {
        pIconName: 'PIFolderPlus',
        pValue: 'Nouveau dossier',
        pActionName: 'toolbox-create-action-click'
      },
      {
        pIconName: 'PIInputCursorText',
        pValue: 'Renommer dossier',
        pActionName: 'toolbox-rename-action-click'
      },
      {
        pIconName: 'PIDownload',
        pValue: 'Télécharger',
        pActionName: 'toolbox-download-action-click'

      }
    ]

    expect(res).toStrictEqual(expectedRes)
  })
})
