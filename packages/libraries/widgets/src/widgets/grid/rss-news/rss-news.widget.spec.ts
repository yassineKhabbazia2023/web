import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@widgets/__mocks__/widget-install.mocks'

import RssNewsWidget from './rss-news.widget'

describe('rss-news widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(RssNewsWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.RSS_NEWS, asyncComponentMatcher())
  })
})
