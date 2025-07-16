import { describe, it, expect } from 'vitest'
import { loggerMock } from '@pulse/core/mocks'
import { getMockedDropdownOptions } from './PDropdown.mocks'
import type { DropdownGroup, PDropdownOption } from './PDropdownTypes'

import { getDropdownGroups, getHasGroups, getIsCheckAll, getAllEnabledValues, getInternalOptions } from './PDropdownUtils'

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

describe('test PDropdownUtils', () => {
  describe('getDropdownGroups()', () => {
    it('should return options regrouped by label', async () => {
      const options = getMockedDropdownOptions(true)
      const groups = getDropdownGroups(options)
      await expect(groups).toMatchFileSnapshot('__snapshots__/PDropdownUtils/getDropdownGroups.snap')
    })
  })
  describe('getHasGroups()', () => {
    const tests = [{
      groups: [{
        label: '',
      }, {
        label: 'b',
      }],
      expected: true,
      reason: 'at least two groups',
    }, {
      groups: [{
        label: 'a',
      }],
      expected: true,
      reason: 'at least one group with a label',
    }, {
      groups: [{
        label: '',
      }],
      expected: false,
      reason: 'one group without label',
    }, {
      groups: [],
      expected: false,
      reason: 'no group',
    }]
    it.each(tests)('should return $expected when $reason', ({ groups, expected }) => {
      const hasGroups = getHasGroups(groups as DropdownGroup[])
      expect(hasGroups).toBe(expected)
    })
  })

  describe('getAllEnabledValues', () => {
    it('should return only enabled values', () => {
      const pOptions = getMockedDropdownOptions(false)
      const expected = ['a', 'b', 'c']
      const allEnabledValues = getAllEnabledValues(pOptions)

      expect(allEnabledValues).toStrictEqual(expected)
    })
  })

  describe('getIsCheckAll', () => {
    const pOptions = getMockedDropdownOptions(false)
    const allValues = getAllEnabledValues(pOptions)
    const tests = [{
      pOptions,
      modelValue: allValues,
      expected: true,
      reason: 'All enabled options are checked',
    }, {
      pOptions,
      modelValue: allValues.slice(-1),
      expected: false,
      reason: 'Some options are NOT checked',
    }, {
      pOptions: [],
      modelValue: allValues,
      expected: false,
      reason: 'pOptions is empty',
    }, {
      pOptions,
      modelValue: allValues.at(0),
      expected: false,
      reason: 'modelValue is not an array',
    }, {
      pOptions,
      modelValue: undefined,
      expected: false,
      reason: 'modelValue is undefined',
    }]
    it.each(tests)('shoud return $expected when $reason', ({
      pOptions,
      modelValue,
      expected,
    }) => {
      const isCheckedAll = getIsCheckAll(pOptions, modelValue)

      expect(isCheckedAll).toBe(expected)
    })
  })

  describe('getInternalOptions', () => {
    it('should return internal value and call logger.warn properly', () => {
      const objetValueMock = {
        a: 'B',
      }
      const options: PDropdownOption[] = [{
        pValue: 'a',
        pLabel: 'John',
        pDisabled: false,
      }, {
        pValue: objetValueMock,
        pLabel: 'Maria',
        pDisabled: false,
      }]
      const expectedInternalOptions = [{
        ...options[0],
        internalValue: options[0].pValue,
      }, {
        ...options[1],
        internalValue: undefined,
      }]
      const expectedLoggerWarnError = [
        'Unexpected undefined value for option',
        options[1],
      ]

      const internalOptions = getInternalOptions(options)
      expect(internalOptions).toStrictEqual(expectedInternalOptions)

      expect(loggerMock.warn).toHaveBeenCalledOnce()
      expect(loggerMock.warn).toHaveBeenCalledWith(...expectedLoggerWarnError)
    })
  })
})
