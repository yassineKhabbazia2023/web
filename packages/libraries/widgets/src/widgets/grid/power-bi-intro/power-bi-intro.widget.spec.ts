import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@widgets/__mocks__/widget-install.mocks'

import PowerBiIntroWidget from './power-bi-intro.widget'

describe('power-bi-intro widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(PowerBiIntroWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.POWERBI_INTRO, asyncComponentMatcher())
  })
})
