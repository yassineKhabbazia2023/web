import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@widgets/__mocks__/widget-install.mocks'

import ContactsWidget from './contacts.widget'

describe('contacts widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(ContactsWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.CONTACTS, asyncComponentMatcher())
  })
})
