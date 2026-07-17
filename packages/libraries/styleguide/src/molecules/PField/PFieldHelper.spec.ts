import {
  getModelValueAsArray,
  getInternalCheckboxOptions,
  getModelValueOnCheckboxChange,
} from './PFieldHelper'
import type { PFieldRadioOptions } from './PFieldTypes'

const options: PFieldRadioOptions[] = [{
  pValue: 'a',
  pLabel: 'A',
}, {
  pValue: 'b',
  pLabel: 'B',
}, {
  pValue: 'c',
  pLabel: 'C',
}]

describe('test PFieldHelper', () => {
  describe('getModelValueAsArray', () => {
    const tests = [{
      modelValue: ['a'],
      expected: ['a'],
      reason: 'array given',
    }, {
      modelValue: 'a',
      expected: [],
      reason: 'string given',
    }, {
      modelValue: undefined,
      expected: [],
      reason: 'undefined given',
    }]
    it.each(tests)('should return $expected when $reason', ({
      modelValue,
      expected,
    }) => {
      const modelValueArray = getModelValueAsArray<string>(modelValue)

      expect(modelValueArray).toStrictEqual(expected)
    })
  })

  describe('getInternalCheckboxOptions', () => {
    it('should return proper internal checkbox options', () => {
      const modelValue = ['b']
      const modelValueArray = getInternalCheckboxOptions<string>(
        modelValue,
        options,
      )
      const expected = [{
        isChecked: false,
        label: 'A',
      }, {
        isChecked: true,
        label: 'B',
      }, {
        isChecked: false,
        label: 'C',
      }]

      expect(modelValueArray).toStrictEqual(expected)
    })
  })

  describe('getModelValueOnCheckboxChange', () => {
    const modelValue = ['b']
    const tests1 = [{
      optionIndex: 0,
      isChecked: true,
      expected: ['b', 'a'],
      reason: 'not checked',
    }, {
      optionIndex: 1,
      isChecked: false,
      expected: [],
      reason: 'should be deselected',
    }, {
      optionIndex: 2,
      isChecked: true,
      expected: ['b', 'c'],
      reason: 'should be selected',
    }]
    it.each(tests1)('should return new model value', ({
      optionIndex,
      isChecked,
      expected,
    }) => {
      const newModelValue = getModelValueOnCheckboxChange<string>(
        modelValue,
        options,
        optionIndex,
        isChecked,
      )

      expect(newModelValue).toStrictEqual(expected)
    })
    const tests2 = [{
      optionIndex: 0,
      isChecked: false,
      reason: 'already unchecked',
    }, {
      optionIndex: 1,
      isChecked: true,
      reason: 'already checked',
    }, {
      optionIndex: 2,
      isChecked: false,
      reason: 'already unchecked',
    }]
    it.each(tests2)('should return undefined when model value does not change', ({
      optionIndex,
      isChecked,
    }) => {
      const newModelValue = getModelValueOnCheckboxChange<string>(
        modelValue,
        options,
        optionIndex,
        isChecked,
      )

      expect(newModelValue).toBeUndefined()
    })
  })
})
