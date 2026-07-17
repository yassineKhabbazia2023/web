import { certifiedDocument, notCertifiedDocument } from '@ged/__mocks__/documents.mocks'

import { getIsDocumentCertified } from './documents.helper'

describe('documents helper', () => {
  it.each([
    {
      title: 'returns true when document is certified',
      document: certifiedDocument,
      expectedReturnValue: true,
    },
    {
      title: 'returns false when document is not certified',
      document: notCertifiedDocument,
      expectedReturnValue: false,
    },
  ])('$title', ({ document, expectedReturnValue }) => {
    const result = getIsDocumentCertified(document)
    expect(result).toBe(expectedReturnValue)
  })
})
