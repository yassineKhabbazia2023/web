
import { it, expect, describe } from 'vitest'
import {
  generateActionBarRightSideButtons,
  generateActionBarLeftSideButtons,
} from './DocumentsActionsHelpers'
import { getData, getData2 } from './getData'

describe('documentsActionsHelpers', () => {
  describe('generateActionBarRightSideButtons', () => {
    it('should return mapped permission actions', () => {
      expect.hasAssertions()
      const permissions = ['CAN_MOVE_DOCUMENT']
      const isDocumentSelected = true
      const res = generateActionBarRightSideButtons(permissions, isDocumentSelected)

      const data = getData(false)
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
          isLoading: true,
        },
      )

      const data = getData(true)
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
        hasFiltersEnabled,
      )

      const data = getData2('Filtrer')
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
        hasFiltersEnabled,
      )

      const data = getData2('Filtrer (1)')
      expect(res).toStrictEqual(data)
    })
  })
})

