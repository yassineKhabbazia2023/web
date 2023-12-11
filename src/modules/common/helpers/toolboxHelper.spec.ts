import { generateToolboxBasicData } from './toolboxHelper'
import { describe, it, expect } from 'vitest'

describe('toolbox helper', () => {
  describe('should return the propper toolbox line based on permissions and target', () => {
    const cases = [
      {
        target: 'Folders',
        permissions: ['CAN_DELETE_FOLDER', 'CAN_RENAME_FOLDER'],
        expectedResult: [
          {
            pIconName: 'PIInputCursorText',
            pValue: 'Renommer dossier',
            pActionName: 'toolbox-rename-action-click'
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
      },
      {
        target: 'Documents',
        permissions: ['CAN_DELETE_DOCUMENT', 'CAN_RENAME_DOCUMENT'],
        expectedResult: [
          {
            pIconName: 'PIInputCursorText',
            pValue: 'Renommer',
            pActionName: 'rename-document'
          },
          {
            pIconName: 'PIDownload',
            pValue: 'Télécharger',
            pActionName: 'download-document'
          },
          {
            pIconName: 'PITrash',
            pValue: 'Supprimer',
            pActionName: 'delete-document'
          }
        ]
      }
    ]

    it.each(cases)(
      'pText mapping validation',
      async ({ target, permissions, expectedResult }) => {
        const result = generateToolboxBasicData(target, permissions)
        expect(result).toStrictEqual(expectedResult)
      }
    )
  })
})

