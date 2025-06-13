import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WidgetsService } from './widgets.service'
import { WidgetName } from '@pulse/widgets/enums'
import { usePermissionsStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'

describe('WidgetsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  getStoreMock(usePermissionsStore)


  describe('getHomeWidgetNames', () => {
    it.each([
      {
        testName: 'should return widgets for users with Pennylane offer when hasPennylaneOffer returns true',
        hasPennylaneOffer: true,
        expectedWidgets: [
          WidgetName.PENNYLANE_INTRO,
          WidgetName.DIGILAB,
          WidgetName.RSS_NEWS,
          WidgetName.POWERBI_INTRO,
        ],
      },
      {
        testName: 'should return widgets for users without Pennylane offer when hasPennylaneOffer returns false',
        hasPennylaneOffer: false,
        expectedWidgets: [
          WidgetName.RSS_NEWS,
          WidgetName.DIGILAB,
        ],
      },
    ])('$testName', ({ hasPennylaneOffer, expectedWidgets }) => {
      vi.spyOn(WidgetsService, 'hasPennylane').mockReturnValue(hasPennylaneOffer)

      const homeWidgetNames = WidgetsService.getHomeWidgetNames()

      expect(homeWidgetNames).toEqual(expectedWidgets)
      expect(WidgetsService.hasPennylane).toHaveBeenCalledOnce()
    })
  })

  describe('hasPennylane', () => {
    const permissionsStore = getStoreMock(usePermissionsStore)

    it.each([
      {
        testName: 'should return true when user has Pennylane permission',
        hasPennylanePermission: true,
        expected: true,
      },
      {
        testName: 'should return false when user does not have Pennylane permission',
        hasPennylanePermission: false,
        expected: false,
      },
    ])('$testName', ({ hasPennylanePermission, expected }) => {
      permissionsStore.getHasPennylanePermission.mockReturnValue(hasPennylanePermission)

      const result = WidgetsService.hasPennylane()

      expect(result).toBe(expected)
      expect(permissionsStore.getHasPennylanePermission).toHaveBeenCalledTimes(1)
    })
  })
})
