import { WidgetName } from '@pulse/widgets/enums'
import { CurrentUserManager } from '@pulse/common/managers'

export enum HomeWidgetNames {
  USER_WITH_PENNYLANE_OFFER = 'userWithPennylaneOffer',
  USER_WITHOUT_PENNYLANE_OFFER = 'userWithoutPennylaneOffer',
}

const userWithPennylaneOfferWidgetNames = [
  WidgetName.PENNYLANE_INTRO,
  WidgetName.DIGILAB,
  WidgetName.RSS_NEWS,
  WidgetName.POWERBI_INTRO,
]

const userWithoutPennylaneOfferWidgetNames = [
  WidgetName.RSS_NEWS,
  WidgetName.DIGILAB,
]

const userWithPennylaneAndGedWidgetNames = [
  WidgetName.PENNYLANE_INTRO,
  WidgetName.PENNYLANE_DOCUMENTS,
  WidgetName.DIGILAB,
  WidgetName.RSS_NEWS,
  WidgetName.POWERBI_INTRO,
]

// Done this way until we have a full experience layer / BackForFront work flow
export class WidgetsService {
  static getHomeWidgetNames() {
    const hasPennylanePermission = CurrentUserManager.getHasPennylanePermission()
    const hasGedComptaPermission = CurrentUserManager.getHasGedComptaPermission()

    if (hasPennylanePermission === true && hasGedComptaPermission === true) {
      return userWithPennylaneAndGedWidgetNames
    }
    if (hasPennylanePermission === true) {
      return userWithPennylaneOfferWidgetNames
    }
    return userWithoutPennylaneOfferWidgetNames
  }
}
