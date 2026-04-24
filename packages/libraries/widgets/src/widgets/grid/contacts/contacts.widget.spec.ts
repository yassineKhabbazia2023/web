import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent } from 'vue'

import ContactsWidget from './contacts.widget'

vi.mock('vue')

describe('contacts widget', () => {
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
      WidgetName.CONTACTS,
      expect.any(Promise),
    ]

    const defineAsyncComponentSpy = vi
      .mocked(defineAsyncComponent)
      .mockImplementation((callback: any) => callback())

    ContactsWidget.install(app, _options)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(...expectedAppComponentArguments)
    expect(defineAsyncComponentSpy).toHaveBeenCalledExactlyOnceWith(...expectedDefineAsyncComponentArguments)
  })
})
