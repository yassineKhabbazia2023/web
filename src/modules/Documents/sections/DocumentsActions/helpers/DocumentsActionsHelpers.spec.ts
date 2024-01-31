/* eslint-disable vitest/no-hooks */
import { it, expect, describe } from 'vitest'
import {
  generateActionBarRightSideButtons,
  generateActionBarLeftSideButtons
} from './DocumentsActionsHelpers'

describe('documentsActionsHelpers', () => {

  describe('generateActionBarRightSideButtons', () => {
    it('should return mapped permission actions', () => {
      expect.hasAssertions()
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

    it('should set loading state to the right permission button', () => {
      expect.hasAssertions()
      const permissions = ['CAN_MOVE_DOCUMENT']
      const isDocumentSelected = true
      const res = generateActionBarRightSideButtons(
        permissions,
        isDocumentSelected,
        {
          permission: 'CAN_MOVE_DOCUMENT',
          isLoading: true
        }
      )

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
            pLoading: true,
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
      expect.hasAssertions()
      const permissions = ['']
      const isDocumentSelected = false
      const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)
      expect(res).toStrictEqual([])
    })
  })

  describe('generateActionBarLeftSideButtons', () => {
    it('should return mapped permission actions when hasFiltersEnabled is false', () => {
      expect.hasAssertions()
      const permissions = ['CAN_MOVE_DOCUMENT']
      const hasFiltersEnabled = false
      const res = generateActionBarLeftSideButtons(
        permissions,
        false,
        false,
        hasFiltersEnabled
      )

      const data = [
        {
          pButtonName: 'Déposer un document',
          pButton: {
            pType: 'primary',
            pPlain: false,
            pRound: false,
            pCircle: false,
            pLoading: false,
            pDisabled: false,
            pSize: 'small'
          },
          pButtonIcon: 'PIUpload',
          pButtonActionName: 'actionbar-add-document-action-click',
          pComponentType: 'UPLOAD',
          pMultiple: true
        },
        {
          pButtonName: 'Filtrer',
          pButton: {
            pType: 'primary',
            pPlain: true,
            pRound: false,
            pCircle: false,
            pLoading: false,
            pDisabled: false,
            pSize: 'small'
          },
          pButtonIcon: 'PIFunnel',
          pButtonActionName: 'actionbar-filter-action-click'
        },
        {
          pButtonName: '',
          pButton: {
            pType: 'white',
            pPlain: false,
            pRound: false,
            pCircle: true,
            pLoading: false,
            pDisabled: false,
            pSize: 'small'
          },
          pButtonIcon: 'PISearch',
          pButtonActionName: 'actionbar-search-action-click',
          pComponentType: 'SEARCH',
          pIsSearchOpen: false,
          pIsSearchShrinkable: false
        }
      ]
      expect(res).toStrictEqual(data)
    })

    it('should return mapped permission actions when hasFiltersEnabled is true', () => {
      expect.hasAssertions()
      const permissions = ['CAN_MOVE_DOCUMENT']
      const hasFiltersEnabled = true
      const res = generateActionBarLeftSideButtons(
        permissions,
        false,
        false,
        hasFiltersEnabled
      )

      const data = [
        {
          pButtonName: 'Déposer un document',
          pButton: {
            pType: 'primary',
            pPlain: false,
            pRound: false,
            pCircle: false,
            pLoading: false,
            pDisabled: false,
            pSize: 'small'
          },
          pButtonIcon: 'PIUpload',
          pButtonActionName: 'actionbar-add-document-action-click',
          pComponentType: 'UPLOAD',
          pMultiple: true
        },
        {
          pButtonName: 'Filtrer (1)',
          pButton: {
            pType: 'primary',
            pPlain: true,
            pRound: false,
            pCircle: false,
            pLoading: false,
            pDisabled: false,
            pSize: 'small'
          },
          pButtonIcon: 'PIFunnel',
          pButtonActionName: 'actionbar-filter-action-click'
        },
        {
          pButtonName: '',
          pButton: {
            pType: 'white',
            pPlain: false,
            pRound: false,
            pCircle: true,
            pLoading: false,
            pDisabled: false,
            pSize: 'small'
          },
          pButtonIcon: 'PISearch',
          pButtonActionName: 'actionbar-search-action-click',
          pComponentType: 'SEARCH',
          pIsSearchOpen: false,
          pIsSearchShrinkable: false
        }
      ]
      expect(res).toStrictEqual(data)
    })
  })
})

