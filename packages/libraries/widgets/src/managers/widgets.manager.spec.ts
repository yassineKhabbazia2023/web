import { WidgetName } from '../enums/widgets.enums'
import type { WidgetDefinition } from '../types/widget.types'

import { WidgetsManager } from './widgets.manager'

const widget1: WidgetDefinition = {
  name: WidgetName.DIGILAB,
  size: 1,
}
const widget2: WidgetDefinition = {
  name: WidgetName.RSS_NEWS,
  size: 2,
}

describe('WidgetsManager', () => {
  beforeEach(() => {
    // Reset the widgets array before each test
    WidgetsManager.unregisterAllWidgets()
  })

  it('should start with an empty widgets array', () => {
    expect(WidgetsManager.getWidgetDefinitions()).toEqual([])
  })

  describe('WidgetsManager - registration and un-registration', () => {
    it('should register a widget', () => {
      WidgetsManager.registerWidget(widget1)
      expect(WidgetsManager.getWidgetDefinitions()).toEqual([widget1])
    })

    it('should register multiple widgets', () => {
      WidgetsManager.registerWidget(widget1)
      WidgetsManager.registerWidget(widget2)
      expect(WidgetsManager.getWidgetDefinitions()).toEqual([widget1, widget2])
    })

    it("shouldn't register the same widget multiple times", () => {
      WidgetsManager.registerWidget(widget1)
      WidgetsManager.registerWidget(widget1)
      expect(WidgetsManager.getWidgetDefinitions()).toEqual([widget1])
    })

    it('should unregister a widget', () => {
      WidgetsManager.registerWidget(widget1)
      WidgetsManager.registerWidget(widget2)
      WidgetsManager.unregisterWidget(widget1.name)
      expect(WidgetsManager.getWidgetDefinitions()).toEqual([widget2])
    })

    it('should do nothing when unregistering a non-existent widget', () => {
      WidgetsManager.registerWidget(widget1)
      WidgetsManager.unregisterWidget(widget2.name) // Non registered widget
      expect(WidgetsManager.getWidgetDefinitions()).toEqual([widget1])
    })
  })
  describe('WidgetsManager - get widgets', () => {
    it('should return all widgets when no section is specified', () => {
      WidgetsManager.registerWidget(widget1)
      WidgetsManager.registerWidget(widget2)
      expect(WidgetsManager.getWidgetDefinitions()).toEqual([widget1, widget2])
    })
  })
})
