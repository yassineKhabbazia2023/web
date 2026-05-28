import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent } from 'vue'

import PennylaneDocumentWidget from './pennylane-documents.widget'

vi.mock('vue')

describe('pennylane-document widget', () => {
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
      WidgetName.PENNYLANE_DOCUMENTS,
      expect.any(Promise),
    ]

    const defineAsyncComponentSpy = vi
      .mocked(defineAsyncComponent)
      .mockImplementation((callback: any) => callback())

    PennylaneDocumentWidget.install(app, _options)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(...expectedAppComponentArguments)
    expect(defineAsyncComponentSpy).toHaveBeenCalledExactlyOnceWith(...expectedDefineAsyncComponentArguments)
  })
})

