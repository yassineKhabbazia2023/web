import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent } from 'vue'

import DigiLabWidget from './digi-lab.widget'

vi.mock('vue')

describe('digi-lab widget', () => {
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
      WidgetName.DIGILAB,
      expect.any(Promise),
    ]

    const defineAsyncComponentSpy = vi
      .mocked(defineAsyncComponent)
      .mockImplementation((callback: any) => callback())

    DigiLabWidget.install(app, _options)

    expect(appComponentMock).toHaveBeenCalledOnce()
    expect(defineAsyncComponentSpy).toHaveBeenCalledOnce()
    expect(defineAsyncComponentSpy).toHaveBeenCalledWith(...expectedDefineAsyncComponentArguments)
    expect(appComponentMock).toHaveBeenCalledWith(...expectedAppComponentArguments)
  })
})

