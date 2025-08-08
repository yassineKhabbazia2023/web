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
        hasGedCompta: false,
        expectedWidgets: [
          WidgetName.PENNYLANE_INTRO,
          WidgetName.DIGILAB,
          WidgetName.RSS_NEWS,
          WidgetName.POWERBI_INTRO,
        ],
      },
      {
        testName: 'when hasPennylaneOffer returns true and hasGedCompta returns true',
        hasPennylaneOffer: true,
        hasGedCompta: true,
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
        hasGedCompta: true,
        expectedWidgets: [
          WidgetName.RSS_NEWS,
          WidgetName.DIGILAB,
        ],
      },
    ])('shoud return proper list when $testName', ({
      hasPennylaneOffer,
      hasGedCompta,
      expectedWidgets,
    }) => {
      vi.mocked(CurrentUserManager).getHasPennylanePermission.mockReturnValue(hasPennylaneOffer)
      vi.mocked(CurrentUserManager).getHasGedComptaPermission.mockReturnValue(hasGedCompta)

      const homeWidgetNames = WidgetsService.getHomeWidgetNames()

      expect(homeWidgetNames).toEqual(expectedWidgets)
      expect(vi.mocked(CurrentUserManager).getHasPennylanePermission).toHaveBeenCalledOnce()
      expect(vi.mocked(CurrentUserManager).getHasGedComptaPermission).toHaveBeenCalledOnce()
    })
  })
})
