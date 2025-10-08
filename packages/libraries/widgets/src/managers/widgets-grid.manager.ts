import { logger } from '@pulse/toolbox'
import { WidgetName } from '../enums/widgets.enums'
import type { WidgetGridDefinition } from '../types/widget.types'

export class WidgetsGridManager {
  private static widgetGridDefinitions: WidgetGridDefinition[] = []

  static registerWidget(widgetGridDefinition: WidgetGridDefinition): void {
    const isWidgetRegistered =
      WidgetsGridManager.widgetGridDefinitions.some(widget => widget.name === widgetGridDefinition.name)

    if (isWidgetRegistered === false) {
      // ensure uniqueness
      WidgetsGridManager.widgetGridDefinitions.push(widgetGridDefinition)
    } else {
      logger.debug(`Widget ${widgetGridDefinition.name} is already registered`)
    }
  }

  static unregisterWidget(widgetName: WidgetName): void {
    WidgetsGridManager.widgetGridDefinitions =
      WidgetsGridManager.widgetGridDefinitions.filter(widget => widget.name !== widgetName)
  }

  static unregisterAllWidgets(): void {
    WidgetsGridManager.widgetGridDefinitions = []
  }

  static getWidgetGridDefinition(widgetName: WidgetName): WidgetGridDefinition | undefined {
    return WidgetsGridManager.widgetGridDefinitions.find(widget => widget.name === widgetName)
  }

  static getWidgetGridDefinitions(): WidgetGridDefinition[] {
    return WidgetsGridManager.widgetGridDefinitions
  }
}
