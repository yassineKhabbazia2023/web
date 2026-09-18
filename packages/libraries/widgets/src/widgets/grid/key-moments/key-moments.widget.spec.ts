import { WidgetName, WidgetScope, WidgetSize } from '@pulse/widgets/enums'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@widgets/__mocks__/widget-install.mocks'

import KeyMomentsWidget from './key-moments.widget'

describe('key-moments widget', () => {
  beforeEach(() => {
    // doctrine: static-classes — spied rather than left to write into the
    // registry the whole worker shares
    vi.spyOn(WidgetsGridManager, 'registerWidget').mockImplementation(() => {})
  })

  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(KeyMomentsWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.KEY_MOMENTS, asyncComponentMatcher())
  })

  it('should register itself on a row of its own reserved to the customer surface', () => {
    installWidgetOnAppMock(KeyMomentsWidget)

    expect(WidgetsGridManager.registerWidget).toHaveBeenCalledExactlyOnceWith({
      name: WidgetName.KEY_MOMENTS,
      size: WidgetSize.THREE_SPANS,
      scope: [WidgetScope.CUSTOMER],
    })
  })
})
