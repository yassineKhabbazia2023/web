import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@widgets/__mocks__/widget-install.mocks'

import PennylaneIntro from './pennylane-intro.widget'

describe('pennylane-intro widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(PennylaneIntro)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.PENNYLANE_INTRO, asyncComponentMatcher())
  })
})
