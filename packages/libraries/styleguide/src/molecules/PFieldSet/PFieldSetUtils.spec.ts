import { describe, it, expect } from 'vitest'
import { getMockedFields } from './PFieldSet.mocks'
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
      disabledFieldKeys: [],
    }, {
      pReadonly: true,
      disabledFieldKeys: [],
    }, {
      pReadonly: false,
      disabledFieldKeys: ['person.lastname'],
    }, {
      pReadonly: true,
      disabledFieldKeys: ['person.lastname'],
    }]
    it.each(tests)('should return mapped fields %s', async ({ pReadonly, disabledFieldKeys }) => {
      const fields = getMockedFields('companyIdentification', pReadonly)
      const internalFields = getInternalFields(fields, model, pReadonly, disabledFieldKeys)

      const snapSuffix = disabledFieldKeys.length > 0
        ? `-${disabledFieldKeys.join('-')}`
        : ''
      await expect(internalFields).toMatchFileSnapshot(`__snapshots__/getInternalFields/readonly-${pReadonly}${snapSuffix}.snap`)
    })
  })
})
