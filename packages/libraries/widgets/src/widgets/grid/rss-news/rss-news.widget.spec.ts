import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent } from 'vue'

import RssNewsWidget from './rss-news.widget'

vi.mock('vue')

describe('rss-news widget', () => {
  it('should install', () => {
    const _options: any = {}
    const appComponentMock = vi.fn()
    const app: any = {
      component: appComponentMock,
    }

    const expectedDefineAsyncComponentArguments = [
      expect.any(Function),
    ]
    const expectedAppComponentArguments = [
      WidgetName.RSS_NEWS,
      expect.any(Promise),
    ]

    const defineAsyncComponentSpy = vi
      .mocked(defineAsyncComponent)
      .mockImplementation((callback: any) => callback())

    RssNewsWidget.install(app, _options)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(...expectedAppComponentArguments)
    expect(defineAsyncComponentSpy).toHaveBeenCalledExactlyOnceWith(...expectedDefineAsyncComponentArguments)
  })
})

