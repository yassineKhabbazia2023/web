import { WidgetName } from '@pulse/widgets/enums'
import { CurrentUserManager } from '@pulse/common/managers'

import { WidgetsService } from './widgets.service'

vi.mock('@pulse/common/managers')

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
          WidgetName.POWERBI_INTRO,
        ],
      },
      {
        testName: 'when hasPennylaneOffer returns false',
        hasPennylaneOffer: false,
        expectedWidgets: [
          WidgetName.RSS_NEWS,
          WidgetName.DIGILAB,
        ],
      },
    ])('shoud return proper list when $testName', ({
      hasPennylaneOffer,
      expectedWidgets,
    }) => {
      vi.mocked(CurrentUserManager).hasSelectedEntityPennylanePermission.mockReturnValue(hasPennylaneOffer)

      const homeWidgetNames = WidgetsService.getHomeWidgetNames()

      expect(homeWidgetNames).toEqual(expectedWidgets)
      expect(vi.mocked(CurrentUserManager).hasSelectedEntityPennylanePermission).toHaveBeenCalledOnce()
    })
  })
})
