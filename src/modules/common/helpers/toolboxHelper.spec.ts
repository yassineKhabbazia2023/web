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
            iconName: 'PIInputCursorText',
            value: 'Renommer dossier',
            actionName: 'toolbox-rename-action-click'
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
      },
      {
        target: 'Documents',
        permissions: ['CAN_DELETE_DOCUMENT', 'CAN_RENAME_DOCUMENT'],
        expectedResult: [
          {
            iconName: 'PIInputCursorText',
            value: 'Renommer',
            actionName: 'rename-document'
          },
          {
            iconName: 'PIDownload',
            value: 'Télécharger',
            actionName: 'download-document'
          },
          {
            iconName: 'PITrash',
            value: 'Supprimer',
            actionName: 'delete-document'
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

