import type { MockInstance } from 'vitest'
import { WidgetName } from '@pulse/widgets/enums'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { ReportingManager } from '@pulse/common/managers'

import { WidgetsService } from './widgets.service'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

let canShowSmartOfferWidgetMock: MockInstance

describe('WidgetsService', () => {
  beforeEach(() => {
    // Called on every path: the smart offer takes precedence over the pennylane one.
    canShowSmartOfferWidgetMock = vi.spyOn(ReportingManager, 'canShowSmartOfferWidget').mockReturnValue(false)
  })

  describe('getHomeWidgetNames', () => {
    describe('desktop (isMobile = false)', () => {
      it.each([
        {
          testName: 'when hasPennylaneOffer returns true',
          hasPennylaneOffer: true,
          expectedWidgets: [
            WidgetName.PENNYLANE_INTRO,
            WidgetName.PENNYLANE_DOCUMENTS,
            WidgetName.DIGILAB,
            WidgetName.RSS_NEWS,
            WidgetName.BOOKING_APPOINTMENT,
            WidgetName.POWERBI_INTRO,
          ],
        },
        {
          testName: 'when hasPennylaneOffer returns true and hasGedCompta returns true',
          hasPennylaneOffer: true,
          expectedWidgets: [
            WidgetName.PENNYLANE_INTRO,
            WidgetName.PENNYLANE_DOCUMENTS,
            WidgetName.DIGILAB,
            WidgetName.RSS_NEWS,
            WidgetName.BOOKING_APPOINTMENT,
            WidgetName.POWERBI_INTRO,
          ],
        },
        {
          testName: 'when hasPennylaneOffer returns false',
          hasPennylaneOffer: false,
          expectedWidgets: [
            WidgetName.RSS_NEWS,
            WidgetName.DIGILAB,
            WidgetName.BOOKING_APPOINTMENT,
          ],
        },
      ])('shoud return proper list when $testName', ({
        hasPennylaneOffer,
        expectedWidgets,
      }) => {
        currentEntityStoreMock.hasOffer.mockReturnValue(hasPennylaneOffer)

        const homeWidgetNames = WidgetsService.getHomeWidgetNames()

        expect(homeWidgetNames).toEqual(expectedWidgets)
        expect(currentEntityStoreMock.hasOffer).toHaveBeenCalledOnce()
      })
    })

    describe('mobile (isMobile = true)', () => {
      it.each([
        {
          testName: 'when user has Pennylane offer',
          hasPennylaneOffer: true,
          canShowSmartOffer: false,
          expectedWidgets: [
            WidgetName.PENNYLANE_DOCUMENTS,
            WidgetName.RSS_NEWS,
            WidgetName.DIGILAB,
          ],
        },
        {
          testName: 'when user does not have Pennylane offer',
          hasPennylaneOffer: false,
          canShowSmartOffer: false,
          expectedWidgets: [
            WidgetName.RSS_NEWS,
            WidgetName.DIGILAB,
          ],
        },
        {
          testName: 'when user has Smart offer',
          hasPennylaneOffer: false,
          canShowSmartOffer: true,
          expectedWidgets: [
            WidgetName.RSS_NEWS,
            WidgetName.DIGILAB,
          ],
        },
      ])('should return filtered list $testName', ({
        hasPennylaneOffer,
        canShowSmartOffer,
        expectedWidgets,
      }) => {
        currentEntityStoreMock.hasOffer.mockReturnValue(hasPennylaneOffer)
        canShowSmartOfferWidgetMock.mockReturnValue(canShowSmartOffer)

        const homeWidgetNames = WidgetsService.getHomeWidgetNames(true)

        expect(homeWidgetNames).toEqual(expectedWidgets)
      })

      it('should maintain the correct order of mobile widgets', () => {
        currentEntityStoreMock.hasOffer.mockReturnValue(true)
        canShowSmartOfferWidgetMock.mockReturnValue(false)

        const homeWidgetNames = WidgetsService.getHomeWidgetNames(true)

        expect(homeWidgetNames).toEqual([
          WidgetName.PENNYLANE_DOCUMENTS,
          WidgetName.RSS_NEWS,
          WidgetName.DIGILAB,
        ])
      })
    })
  })
})
