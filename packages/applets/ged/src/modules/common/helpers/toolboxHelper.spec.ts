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
})
