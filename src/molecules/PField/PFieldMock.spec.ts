import { describe, it, expect } from 'vitest'
import { getMockedRule } from './PFieldMock'

describe('testing PFieldSetMock', () => {
  describe('getMockedRule', () => {
    const tests = [{
      ruleType: 'email'
    }, {
      ruleType: 'phone'
    }]
    it.each(tests)('expect to receive proper rules when ruleType is $ruleType', ({ ruleType }) => {
      const rules = getMockedRule(ruleType)
      expect(rules).toMatchFileSnapshot(`__snapshots__/getMockedRule/${ruleType}.snap`)
    })
  })
})
