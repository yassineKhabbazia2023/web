import { WidgetName } from '@pulse/widgets/enums'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { SubscriptionOfferCode } from '@pulse/common/enums'

export enum HomeWidgetNames {
  USER_WITH_PENNYLANE_OFFER = 'userWithPennylaneOffer',
  USER_WITHOUT_PENNYLANE_OFFER = 'userWithoutPennylaneOffer',
}

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
    const selectedEntityStore = useSelectedEntityStore()

    if (selectedEntityStore.hasOffer(SubscriptionOfferCode.PENNYLANE) === true) {
      return userWithPennylaneAndGedWidgetNames
    }

    return userWithoutPennylaneOfferWidgetNames
  }
}
