/* eslint-disable vitest/no-hooks */
import { it, expect, describe } from 'vitest'
import { generateActionBarRightSideButtons } from './DocumentsActionsHelpers'

describe('documentsActionsHelpers', () => {

  it('should return mapped permission actions', () => {
    const permissions = ['CAN_MOVE_DOCUMENT']
    const isDocumentSelected = true
    const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)

    const data = [
      {
        pButtonName: 'Télécharger',
        pButton: {
          pType: 'white',
          pPlain: false,
          pRound: false,
          pCircle: false,
          pLoading: false,
          pDisabled: false,
          pSize: 'small'
        },
        pButtonIcon: 'PIDownload',
        pButtonActionName: 'actionbar-download-action-click'
      },
      {
        pButtonName: 'Déplacer',
        pButton: {
          pType: 'white',
          pPlain: true,
          pRound: false,
          pCircle: false,
          pLoading: false,
          pDisabled: false,
          pSize: 'small'
        },
        pButtonIcon: 'PIFolderMove',
        pButtonActionName: 'actionbar-move-action-click'
      }
    ]
    expect(res).toStrictEqual(data)
  })

  it('should return empty when no document selected', () => {
    const permissions = ['']
    const isDocumentSelected = false
    const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)

    expect(res).toStrictEqual([])
  })
})
