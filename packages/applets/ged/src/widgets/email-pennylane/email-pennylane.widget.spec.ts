import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@pulse/widgets/mocks'

import EmailPennylaneWidget from './email-pennylane.widget'

describe('email-pennylane widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(EmailPennylaneWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.EMAIL_PENNYLANE, asyncComponentMatcher())
  })
})
