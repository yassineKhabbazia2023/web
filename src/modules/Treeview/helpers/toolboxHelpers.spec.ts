import { generateToolboxBasicData } from '@/modules/common/helpers/toolboxHelper'
import { describe, it, expect } from 'vitest'

describe('toolboxHelpers', () => {
  it('should return correct mapping when passing permission array', () => {
    const res = generateToolboxBasicData('Folders',
      ['CAN_CREATE_FOLDER', 'test', 'CAN_DELETE_FOLDER'])

    const expectedRes = [
      {
        iconName: 'PIFolderPlus',
        value: 'Nouveau dossier',
        actionName: 'toolbox-create-action-click'
      },
      {
        iconName: 'PIDownload',
        value: 'Télécharger',
        actionName: 'toolbox-download-action-click'

      },
      {
        iconName: 'PITrash',
        value: 'Supprimer',
        actionName: 'toolbox-delete-action-click'
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
        iconName: 'PIFolderPlus',
        value: 'Nouveau dossier',
        actionName: 'toolbox-create-action-click'
      },
      {
        iconName: 'PIInputCursorText',
        value: 'Renommer dossier',
        actionName: 'toolbox-rename-action-click'
      },
      {
        iconName: 'PIDownload',
        value: 'Télécharger',
        actionName: 'toolbox-download-action-click'

      }
    ]

    expect(res).toStrictEqual(expectedRes)
  })
})
