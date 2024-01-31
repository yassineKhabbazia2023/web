import { describe, it, expect } from 'vitest'
import { getMockedFields } from './PFieldSetMock'

describe('testing PFieldSetMock', () => {
  describe('getMockedFields', () => {
    const tests = [{
      fieldCase: 'companyIdentification'
    }, {
      fieldCase: 'companyContact'
    }, {
      fieldCase: 'companyAddress'
    }, {
      fieldCase: 'accountingAndTaxInformation'
    }]
    it.each(tests)('expect to receive proper fields when fieldCase is $fieldCase', ({ fieldCase }) => {
      const fields = getMockedFields(fieldCase)
      expect(fields).toMatchFileSnapshot(`__snapshots__/PFieldSetMock/${fieldCase}.snap`)
    })
  })
})
