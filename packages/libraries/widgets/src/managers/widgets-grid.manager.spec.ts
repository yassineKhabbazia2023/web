import { WidgetName } from '../enums/widgets.enums'
import type { WidgetGridDefinition } from '../types/widget.types'

import { WidgetsGridManager } from './widgets-grid.manager'

const widget1: WidgetGridDefinition = {
  name: WidgetName.DIGILAB,
  size: 1,
}
const widget2: WidgetGridDefinition = {
  name: WidgetName.RSS_NEWS,
  size: 2,
}

describe('WidgetsGridManager', () => {
  beforeEach(() => {
    // Reset the widgets array before each test
    WidgetsGridManager.unregisterAllWidgets()
  })

  it('should start with an empty widgets array', () => {
    expect(WidgetsGridManager.getWidgetGridDefinitions()).toEqual([])
  })

  describe('WidgetsGridManager - registration and un-registration', () => {
    it('should register a widget', () => {
      WidgetsGridManager.registerWidget(widget1)
      expect(WidgetsGridManager.getWidgetGridDefinitions()).toEqual([widget1])
    })

    it('should register multiple widgets', () => {
      WidgetsGridManager.registerWidget(widget1)
      WidgetsGridManager.registerWidget(widget2)
      expect(WidgetsGridManager.getWidgetGridDefinitions()).toEqual([widget1, widget2])
    })

    it("shouldn't register the same widget multiple times", () => {
      WidgetsGridManager.registerWidget(widget1)
      WidgetsGridManager.registerWidget(widget1)
      expect(WidgetsGridManager.getWidgetGridDefinitions()).toEqual([widget1])
    })

    it('should unregister a widget', () => {
      WidgetsGridManager.registerWidget(widget1)
      WidgetsGridManager.registerWidget(widget2)
      WidgetsGridManager.unregisterWidget(widget1.name)
      expect(WidgetsGridManager.getWidgetGridDefinitions()).toEqual([widget2])
    })

    it('should do nothing when unregistering a non-existent widget', () => {
      WidgetsGridManager.registerWidget(widget1)
      WidgetsGridManager.unregisterWidget(widget2.name) // Non registered widget
      expect(WidgetsGridManager.getWidgetGridDefinitions()).toEqual([widget1])
    })
  })
  describe('WidgetsGridManager - get widgets', () => {
    it('should return all widgets when no section is specified', () => {
      WidgetsGridManager.registerWidget(widget1)
      WidgetsGridManager.registerWidget(widget2)
      expect(WidgetsGridManager.getWidgetGridDefinitions()).toEqual([widget1, widget2])
    })
  })
})
