import { describe, it, expect } from 'vitest'
import { getMockedDropdownOptions } from './PDropdownMocks'
import { getDropdownGroups, getHasGroups } from './PDropdownUtils'
import type { DropdownGroup } from './PDropdownTypes'

describe('test PDropdownUtils', () => {
  describe('getDropdownGroups()', () => {
    it('should return options regrouped by label', () => {
      const options = getMockedDropdownOptions(true)
      const groups = getDropdownGroups(options)
      expect(groups).toMatchFileSnapshot('__snapshots__/PDropdownUtils/getDropdownGroups.snap')
    })
  })
  describe('getHasGroups()', () => {
    const tests = [{
      groups: [{
        label: ''
      }, {
        label: 'b'
      }],
      expected: true,
      reason: 'at least two groups'
    }, {
      groups: [{
        label: 'a'
      }],
      expected: true,
      reason: 'at least one group with a label'
    }, {
      groups: [{
        label: ''
      }],
      expected: false,
      reason: 'one group without label'
    }, {
      groups: [],
      expected: false,
      reason: 'no group'
    }]
    it.each(tests)('should return $expected when $reason', ({ groups, expected }) => {
      const hasGroups = getHasGroups(groups as DropdownGroup[])
      expect(hasGroups).toBe(expected)
    })
  })
})
