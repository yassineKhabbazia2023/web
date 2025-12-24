import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent } from 'vue'

import EmailPennylaneWidget from './email-pennylane.widget'

vi.mock('vue')

describe('email-pennylane widget', () => {
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
      WidgetName.EMAIL_PENNYLANE,
      expect.any(Promise),
    ]

    const defineAsyncComponentSpy = vi
      .mocked(defineAsyncComponent)
      .mockImplementation((callback: any) => callback())

    EmailPennylaneWidget.install(app, _options)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(...expectedAppComponentArguments)
    expect(defineAsyncComponentSpy).toHaveBeenCalledExactlyOnceWith(...expectedDefineAsyncComponentArguments)
  })
})

