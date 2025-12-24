import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent } from 'vue'

import PowerBiIntroWidget from './power-bi-intro.widget'

vi.mock('vue')

describe('power-bi-intro widget', () => {
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
      WidgetName.POWERBI_INTRO,
      expect.any(Promise),
    ]

    const defineAsyncComponentSpy = vi
      .mocked(defineAsyncComponent)
      .mockImplementation((callback: any) => callback())

    PowerBiIntroWidget.install(app, _options)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(...expectedAppComponentArguments)
    expect(defineAsyncComponentSpy).toHaveBeenCalledExactlyOnceWith(...expectedDefineAsyncComponentArguments)
  })
})

