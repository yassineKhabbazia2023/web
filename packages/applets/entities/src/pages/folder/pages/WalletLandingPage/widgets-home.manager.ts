import { logger } from '@pulse/core'
import { WidgetsManager } from '@pulse/widgets/managers'
import type { WidgetDefinition } from '@pulse/widgets/types'
import { WidgetName } from '@pulse/widgets/enums'
import { WidgetsService } from '@entities/services/widgets/widgets.service'

export class WidgetsHomeManager {
  static getWidgetsLayout() {
    const widgets = WidgetsService.getHomeWidgetNames()
    return this.getWidgetDefinitions(widgets)
  }

  static getWidgetDefinitions(widgetNames: WidgetName[]): WidgetDefinition[] {
    return widgetNames
      .map((widgetName) => {
        const widgetDefinition = WidgetsManager.getWidgetDefinition(widgetName)

        if (widgetDefinition) {
          return widgetDefinition
        } else {
          logger.warn(`Widget ${widgetName} not found in WidgetsManager. It will not be displayed.`)
          return undefined
        }
      })
      .filter((widgetDefinition) => widgetDefinition !== undefined)
  }
}
