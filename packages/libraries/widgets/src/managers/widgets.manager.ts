import { logger } from '@pulse/core'
import { WidgetName } from '../enums/widgets.enums'
import type { WidgetDefinition } from '../types/widget.types'

export class WidgetsManager {
  private static widgetDefinitions: WidgetDefinition[] = []

  static registerWidget(widgetDefinition: WidgetDefinition): void {
    const isWidgetRegistered = WidgetsManager.widgetDefinitions.some(widget => widget.name === widgetDefinition.name)

    if (isWidgetRegistered === false) {
      // ensure uniqueness
      WidgetsManager.widgetDefinitions.push(widgetDefinition)
    } else {
      logger.debug(`Widget ${widgetDefinition.name} is already registered`)
    }
  }

  static unregisterWidget(widgetName: WidgetName): void {
    WidgetsManager.widgetDefinitions = WidgetsManager.widgetDefinitions.filter(widget => widget.name !== widgetName)
  }

  static unregisterAllWidgets(): void {
    WidgetsManager.widgetDefinitions = []
  }

  static getWidgetDefinition(widgetName: WidgetName): WidgetDefinition | undefined {
    return WidgetsManager.widgetDefinitions.find(widget => widget.name === widgetName)
  }

  static getWidgetDefinitions(): WidgetDefinition[] {
    return WidgetsManager.widgetDefinitions
  }
}
