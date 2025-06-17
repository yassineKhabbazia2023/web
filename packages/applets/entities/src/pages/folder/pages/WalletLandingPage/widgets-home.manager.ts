import { logger } from '@pulse/core'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import type { WidgetGridDefinition } from '@pulse/widgets/types'
import { WidgetName } from '@pulse/widgets/enums'
import { WidgetsService } from '@entities/services/widgets/widgets.service'

export class WidgetsHomeManager {
  static getWidgetsLayout() {
    const widgets = WidgetsService.getHomeWidgetNames()
    return this.getWidgetGridDefinitions(widgets)
  }

  static getWidgetGridDefinitions(widgetNames: WidgetName[]): WidgetGridDefinition[] {
    return widgetNames
      .map((widgetName) => {
        const widgetGridDefinition = WidgetsGridManager.getWidgetGridDefinition(widgetName)

        if (widgetGridDefinition) {
          return widgetGridDefinition
        } else {
          logger.warn(`Widget ${widgetName} not found in WidgetsGridManager. It will not be displayed.`)
          return undefined
        }
      })
      .filter((widgetGridDefinition) => widgetGridDefinition !== undefined)
  }
}
