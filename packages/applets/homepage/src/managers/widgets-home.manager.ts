import { logger } from '@pulse/toolbox'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import type { WidgetGridDefinition } from '@pulse/widgets/types'
import { WidgetName } from '@pulse/widgets/enums'
import { WidgetsService } from '@pulse/common/services/widgets'
import type { Permission } from '@pulse/common/types'
import { CurrentUserManager } from '@pulse/common/managers'
import { useBookingStore } from '@pulse/common/stores'

export class WidgetsHomeManager {

  static getWidgetsLayout(isCustomer: boolean) {
    const widgetNames = WidgetsService.getHomeWidgetNames()
    return this.getWidgetGridDefinitions(widgetNames, isCustomer)
  }

  static getWidgetGridDefinitions(
    widgetNames: WidgetName[], isCustomer: boolean): WidgetGridDefinition[] {
    const bookingStore = useBookingStore()

    return widgetNames
      .map((widgetName) => {
        const widgetGridDefinition = WidgetsGridManager.getWidgetGridDefinition(widgetName)
        if (
          widgetGridDefinition?.name === WidgetName.BOOKING_RENDEZ_VOUS &&
          bookingStore.hasAvailableExperts() === false
        ) {
          return undefined
        }
        if (isCustomer === true) { // Business rule: Customers need a specific permissions to access certain widgets
          if (widgetGridDefinition !== undefined &&
            this.hasRequiredPermissions(widgetGridDefinition.customerPermission) === false) {
            logger.warn(`Widget ${widgetName} will not be displayed due to missing permissions.`)
            return undefined
          }
        }

        if (widgetGridDefinition) {
          return widgetGridDefinition
        } else {
          logger.warn(`Widget ${widgetName} not found in WidgetsGridManager. It will not be displayed.`)
          return undefined
        }
      })
      .filter((widgetGridDefinition) => widgetGridDefinition !== undefined)
  }

  private static hasRequiredPermissions(
    required: Permission[] | undefined,
  ): boolean {
    if (required === undefined || required.length === 0) {
      return true
    } // No guard defined -> allow rendering

    // Check if the user has all the required permissions
    return CurrentUserManager.hasSelectedEntityPermission(required)
  }
}
