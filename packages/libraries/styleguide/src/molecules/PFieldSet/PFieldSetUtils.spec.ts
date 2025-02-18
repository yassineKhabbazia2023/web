import { describe, it, expect } from 'vitest'
import { getMockedFields } from './PFieldSetMock'
import { getInternalFields } from './PFieldSetUtils'

describe('pFieldSetUtils', () => {
  describe('getInternalFields', () => {
    const model = {
      person: {
        lastname: 'Lennon',
        firstname: 'John',
      },
    }
    const tests = [{
      pReadonly: false,
    }, {
      pReadonly: true,
    }]
    it.each(tests)('should return mapped fields', async ({ pReadonly }) => {
      const fields = getMockedFields('companyIdentification', pReadonly)
      const internalFields = getInternalFields(fields, model, pReadonly)

      await expect(internalFields).toMatchFileSnapshot(`__snapshots__/getInternalFields/readonly-${pReadonly}.snap`)
    })
  })
})
