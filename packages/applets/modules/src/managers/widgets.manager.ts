import { logger } from '@pulse/core'

export class WidgetsManager {
  private static widgets: string[] = []

  static registerWidget(widgetName: string) {
    const isWidgetRegistered = WidgetsManager.widgets.includes(widgetName)

    if (isWidgetRegistered === false) {
      // ensure uniqueness
      WidgetsManager.widgets.push(widgetName)
    } else{
      logger.debug(`Widget ${widgetName} is already registered`)
    }
  }

  static unregisterWidget(widgetName: string) {
    WidgetsManager.widgets = WidgetsManager.widgets.filter(widget => widget !== widgetName)
  }

  static getWidgets() {
    return WidgetsManager.widgets
  }
}
