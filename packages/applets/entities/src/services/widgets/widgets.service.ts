import { WidgetName } from '@pulse/widgets/enums'
import { usePermissionsStore } from '@pulse/common/stores'

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

// Done this way until we have a full experience layer / BackForFront work flow
export class WidgetsService {
  static getHomeWidgetNames() {
    if (this.hasPennylane() === true) {
      return userWithPennylaneOfferWidgetNames
    } else {
      return userWithoutPennylaneOfferWidgetNames
    }
  }

  static hasPennylane() {
    const permissionsStore = usePermissionsStore()
    return permissionsStore.getHasPennylanePermission()
  }
}
