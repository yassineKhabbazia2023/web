import { WidgetName } from '@pulse/widgets/enums'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'

import { WidgetsService } from './widgets.service'

vi.mock('@pulse/common/managers')

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('WidgetsService', () => {
  describe('getHomeWidgetNames', () => {
    it.each([
      {
        testName: 'when hasPennylaneOffer returns true',
        hasPennylaneOffer: true,
        expectedWidgets: [
          WidgetName.PENNYLANE_INTRO,
          WidgetName.PENNYLANE_DOCUMENTS,
          WidgetName.DIGILAB,
          WidgetName.RSS_NEWS,
          WidgetName.BOOKING_RENDEZ_VOUS,
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
          WidgetName.BOOKING_RENDEZ_VOUS,
          WidgetName.POWERBI_INTRO,
        ],
      },
      {
        testName: 'when hasPennylaneOffer returns false',
        hasPennylaneOffer: false,
        expectedWidgets: [
          WidgetName.RSS_NEWS,
          WidgetName.DIGILAB,
          WidgetName.BOOKING_RENDEZ_VOUS,
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
})
