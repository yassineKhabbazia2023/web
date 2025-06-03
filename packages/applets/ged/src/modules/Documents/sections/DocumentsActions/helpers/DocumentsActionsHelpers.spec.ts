
import { it, expect, describe } from 'vitest'
import {
  generateActionBarRightSideButtons,
  generateActionBarLeftSideButtons,
} from './DocumentsActionsHelpers'
import { getData, getData2, getLeftSideActionWithDisabledUpload } from './getData'

describe('documentsActionsHelpers', () => {
  describe('generateActionBarRightSideButtons', () => {
    it('should return mapped permission actions', () => {
      const permissions = ['CAN_MOVE_DOCUMENT']
      const isDocumentSelected = true
      const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)

      const data = getData(false)
      expect(res).toStrictEqual(data) // TODO would be more usual to use toMatchFileSnapshot()
    })

    it('should set loading state to the right permission button', () => {
      const permissions = ['CAN_MOVE_DOCUMENT']
      const isDocumentSelected = true
      const res = generateActionBarRightSideButtons(
        permissions,
        isDocumentSelected,
        {
          permission: 'CAN_MOVE_DOCUMENT',
          isLoading: true,
        },
      )

      const data = getData(true)
      expect(res).toStrictEqual(data) // TODO would be more usual to use toMatchFileSnapshot()
    })
    it('should return empty when no document selected', () => {
      const permissions = ['']
      const isDocumentSelected = false
      const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)
      expect(res).toStrictEqual([])
    })
  })

  describe('generateActionBarLeftSideButtons', () => {
    it('should return mapped permission actions when hasFiltersEnabled is false', () => {
      const permissions = ['CAN_MOVE_DOCUMENT']
      const hasFiltersEnabled = false
      const isCurrentServiceReadOnly = false

      const res = generateActionBarLeftSideButtons(
        permissions,
        false,
        false,
        hasFiltersEnabled,
        isCurrentServiceReadOnly,
      )

      const data = getData2('Filtrer')
      expect(res).toStrictEqual(data) // TODO would be more usual to use toMatchFileSnapshot()
    })

    it('should return mapped permission actions when hasFiltersEnabled is true', () => {
      const permissions = ['CAN_MOVE_DOCUMENT']
      const hasFiltersEnabled = true
      const isCurrentServiceReadOnly = false

      const res = generateActionBarLeftSideButtons(
        permissions,
        false,
        false,
        hasFiltersEnabled,
        isCurrentServiceReadOnly,
      )

      const data = getData2('Filtrer (1)')
      expect(res).toStrictEqual(data) // TODO would be more usual to use toMatchFileSnapshot()
    })

    it('should return a disabled upload button if the current service is readonly', () => {
      const permissions = ['CAN_MOVE_DOCUMENT']
      const hasFiltersEnabled = false
      const isCurrentServiceReadOnly = true

      const result = generateActionBarLeftSideButtons(
        permissions,
        false,
        false,
        hasFiltersEnabled,
        isCurrentServiceReadOnly,
      )

      expect(result).toStrictEqual(getLeftSideActionWithDisabledUpload())
    })
  })
})
