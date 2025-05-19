import { WidgetsManager } from './widgets.manager'

const widget1Name = 'widget1'
const widget2Name = 'widget2'

describe('WidgetsManager', () => {
  beforeEach(() => {
    // Reset the widgets array before each test
    // @ts-expect-error widgets is private but we need to reset it here
    WidgetsManager.widgets = []
  })

  it('should start with an empty widgets array', () => {
    expect(WidgetsManager.getWidgets()).toEqual([])
  })

  it('should register a widget', () => {
    WidgetsManager.registerWidget(widget1Name)
    expect(WidgetsManager.getWidgets()).toEqual([widget1Name])
  })

  it('should register multiple widgets', () => {
    WidgetsManager.registerWidget(widget1Name)
    WidgetsManager.registerWidget(widget2Name)
    expect(WidgetsManager.getWidgets()).toEqual([widget1Name, widget2Name])
  })

  it("shouldn't register the same widget multiple times", () => {
    WidgetsManager.registerWidget(widget1Name)
    WidgetsManager.registerWidget(widget1Name)
    expect(WidgetsManager.getWidgets()).toEqual([widget1Name])
  })

  it('should unregister a widget', () => {
    WidgetsManager.registerWidget(widget1Name)
    WidgetsManager.registerWidget(widget2Name)
    WidgetsManager.unregisterWidget(widget1Name)
    expect(WidgetsManager.getWidgets()).toEqual([widget2Name])
  })

  it('should do nothing when unregistering a non-existent widget', () => {
    WidgetsManager.registerWidget(widget1Name)
    WidgetsManager.unregisterWidget('nonExistentWidget')
    expect(WidgetsManager.getWidgets()).toEqual([widget1Name])
  })
})
