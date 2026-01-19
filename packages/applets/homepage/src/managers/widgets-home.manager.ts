import { logger } from '@pulse/toolbox'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import type { WidgetGridDefinition } from '@pulse/widgets/types'
import { WidgetName, WidgetScope } from '@pulse/widgets/enums'
import { WidgetsService } from '@pulse/common/services/widgets'
import type { Permission } from '@pulse/common/types'
import { CurrentUserManager } from '@pulse/common/managers'

export class WidgetsHomeManager {

  static getWidgetsLayout(isCustomer: boolean) {
    const widgetNames = WidgetsService.getHomeWidgetNames()
    return this.getWidgetGridDefinitions(widgetNames, isCustomer)
  }

  static getWidgetGridDefinitions(
    widgetNames: WidgetName[], isCustomer: boolean): WidgetGridDefinition[] {
    return widgetNames
      .map((widgetName) => {
        const widgetGridDefinition = WidgetsGridManager.getWidgetGridDefinition(widgetName)

        if (widgetGridDefinition === undefined) {
          logger.warn(`Widget ${widgetName} not found in WidgetsGridManager. It will not be displayed.`)
          return undefined
        }

        // Business rule: Check if the widget is in scope for the current user type
        if (this.isInScope(widgetGridDefinition.scope, isCustomer) === false) {
          logger.warn(`Widget ${widgetName} will not be displayed due to scope restrictions.`)
          return undefined
        }

        // Business rule: Customers need specific permissions to access certain widgets
        if (
          isCustomer === true &&
          this.hasRequiredPermissions(widgetGridDefinition.customerPermission) === false
        ) {
          logger.warn(`Widget ${widgetName} will not be displayed due to missing permissions.`)
          return undefined
        }

        return widgetGridDefinition
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
    return CurrentUserManager.hasCurrentEntityPermission(required)
  }

  private static isInScope(
    scope: WidgetScope[] | undefined,
    isCustomer: boolean,
  ): boolean {
    // No scope defined -> allow rendering for everyone
    if (scope === undefined || scope.length === 0) {
      return true
    }

    const requiredScope = isCustomer ? WidgetScope.CUSTOMER : WidgetScope.COLLAB
    return scope.includes(requiredScope)
  }
}
