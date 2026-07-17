import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@widgets/__mocks__/widget-install.mocks'

import DigiLabWidget from './digi-lab.widget'

describe('digi-lab widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(DigiLabWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.DIGILAB, asyncComponentMatcher())
  })
})
