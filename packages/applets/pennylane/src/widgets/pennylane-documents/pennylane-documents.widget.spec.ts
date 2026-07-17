import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@pulse/widgets/mocks'

import PennylaneDocumentWidget from './pennylane-documents.widget'

describe('pennylane-document widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(PennylaneDocumentWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.PENNYLANE_DOCUMENTS, asyncComponentMatcher())
  })
})
