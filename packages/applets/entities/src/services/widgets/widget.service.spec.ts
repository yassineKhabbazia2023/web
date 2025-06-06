import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WidgetsService } from './widgets.service'
import { WidgetName } from '@pulse/widgets/enums'

describe('WidgetsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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
      vi.spyOn(WidgetsService, 'hasPennylaneOffer').mockReturnValue(hasPennylaneOffer)

      const homeWidgetNames = WidgetsService.getHomeWidgetNames()

      expect(homeWidgetNames).toEqual(expectedWidgets)
      expect(WidgetsService.hasPennylaneOffer).toHaveBeenCalledOnce()
    })
  })

  describe('hasPennylaneOffer', () => { // will be updated in upcoming task
    it('should return true by default', () => {
      const result = WidgetsService.hasPennylaneOffer()

      expect(result).toBe(true)
    })
  })
})
