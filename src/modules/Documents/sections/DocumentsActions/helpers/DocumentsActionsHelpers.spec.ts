/* eslint-disable vitest/no-hooks */
import { it, expect, describe } from 'vitest'
import { generateActionBarRightSideButtons } from './DocumentsActionsHelpers'

describe('documentsActionsHelpers', () => {

  it('should return mapped permission actions', () => {
    const permissions = ['CAN_MOVE_DOCUMENT']
    const isDocumentSelected = true
    const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)

    const data = [{
      buttonName: 'Télécharger',
      buttonType: 'white',
      buttonIcon: 'PIDownload',
      buttonActionName: 'actionbar-download-action-click',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: 'Déplacer',
      buttonType: 'white',
      buttonIcon: 'PIFolderMove',
      buttonActionName: 'actionbar-move-action-click',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    }]

    expect(res).toStrictEqual(data)
  })

  it('should return empty when no document selected', () => {
    const permissions = ['']
    const isDocumentSelected = false
    const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)

    expect(res).toStrictEqual([])
  })
})
