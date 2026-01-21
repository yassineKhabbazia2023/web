import { WidgetName } from '@pulse/widgets/enums'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { SubscriptionOfferCode } from '@pulse/common/enums'
import { ReportingManager } from '@pulse/common/managers'

export enum HomeWidgetNames {
  USER_WITH_PENNYLANE_OFFER = 'userWithPennylaneOffer',
  USER_WITHOUT_PENNYLANE_OFFER = 'userWithoutPennylaneOffer',
}

const userWithoutPennylaneOfferWidgetNames = [
  WidgetName.RSS_NEWS,
  WidgetName.DIGILAB,
  WidgetName.BOOKING_APPOINTMENT,
]

const userWithPennylaneAndGedWidgetNames = [
  WidgetName.PENNYLANE_INTRO,
  WidgetName.PENNYLANE_DOCUMENTS,
  WidgetName.DIGILAB,
  WidgetName.RSS_NEWS,
  WidgetName.BOOKING_APPOINTMENT,
  WidgetName.POWERBI_INTRO,
]

const userWithSmartWidgetNames = [
  WidgetName.SMART_INTRO,
  WidgetName.DIGILAB,
  WidgetName.RSS_NEWS,
  WidgetName.BOOKING_APPOINTMENT,
  WidgetName.POWERBI_INTRO,
]

const mobileAllowedWidgets: WidgetName[] = [
  WidgetName.PENNYLANE_DOCUMENTS,
  WidgetName.RSS_NEWS,
  WidgetName.DIGILAB,
]

// Done this way until we have a full experience layer / BackForFront work flow
export class WidgetsService {
  static getHomeWidgetNames(isMobile = false): WidgetName[] {
    const currentEntityStore = useCurrentEntityStore()
    const canShowSmartOfferWidget = ReportingManager.canShowSmartOfferWidget()

    let widgetNames: WidgetName[]

    // Temporary: for the Clarity POC, we prioritized SmartOffer. A carousel will be added once validated.
    if (canShowSmartOfferWidget === true) {
      widgetNames = userWithSmartWidgetNames
    } else if (currentEntityStore.hasOffer(SubscriptionOfferCode.PENNYLANE) === true) {
      widgetNames = userWithPennylaneAndGedWidgetNames
    } else {
      widgetNames = userWithoutPennylaneOfferWidgetNames
    }

    if (isMobile === true) {
      return this.filterForMobile(widgetNames)
    }

    return widgetNames
  }

  private static filterForMobile(widgetNames: WidgetName[]): WidgetName[] {
    return mobileAllowedWidgets.filter((name) => widgetNames.includes(name))
  }
}
