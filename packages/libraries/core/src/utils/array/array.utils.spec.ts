import {
  addIfNotExists,
  removeIfExists,
  arrayIncludes,
  filterRecordByKeyCallback,
  stringContainsAllValues,
} from './array.utils'

describe('test array.utils', () => {
  describe('addIfNotExists', () => {
    it('should add an item to the array if it does not exist', () => {
      const arr = [1, 2, 3]
      const result = addIfNotExists(arr, 4)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should not add an item to the array if it already exists', () => {
      const arr = [1, 2, 3]
      const result = addIfNotExists(arr, 2)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('removeIfExists', () => {
    it('should remove an item from the array if it exists', () => {
      const arr = [1, 2, 3]
      const result = removeIfExists(arr, 2)
      expect(result).toEqual([1, 3])
    })

    it('should not modify the array if the item does not exist', () => {
      const arr = [1, 2, 3]
      const result = removeIfExists(arr, 4)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('arrayIncludes', () => {
    it('should return true if the array includes the single value', () => {
      const array1 = [1, 2, 3]
      const array2 = [2]
      expect(arrayIncludes(array1, array2)).toBe(true)
    })

    it('should return false if the array does not include the single value', () => {
      const array1 = [1, 2, 3]
      const array2 = [4]
      expect(arrayIncludes(array1, array2)).toBe(false)
    })

    it('should return true if the array includes all values in the array of values', () => {
      const array1 = [1, 2, 3, 4]
      const array2 = [2, 3]
      expect(arrayIncludes(array1, array2)).toBe(true)
    })

    it('should return false if the array does not include all values in the array of values', () => {
      const array1 = [1, 2, 3, 4]
      const array2 = [0, 5]
      expect(arrayIncludes(array1, array2)).toBe(false)
    })

    describe('stringContainsAllValues', () => {
      const testCases = [{
        text: 'hello world',
        values: ['hello', 'world'],
        expectedResult: true,
        description: 'text contains all values',
      }, {
        text: 'hello world',
        values: ['hello', 'planet'],
        expectedResult: false,
        description: 'text does not contain all values',
      }, {
        text: 'hello world',
        values: [],
        expectedResult: true,
        description: 'values array is empty',
      }, {
        text: '',
        values: ['hello'],
        expectedResult: false,
        description: 'text is empty and values are not empty',
      }, {
        text: '',
        values: [],
        expectedResult: true,
        description: 'both text and values are empty',
      }]
      it.each(testCases)(
        'should return $expectedResult when $description',
        ({ text, values, expectedResult }) => {
          const result = stringContainsAllValues(text, values)

          expect(result).toBe(expectedResult)
        })
    })
  })

  describe('filterRecordByKeyCallback', () => {
    const key = 'name'
    const record = {
      name: 'John Doe',
      age: '30',
      city: 'New York',
    }
    const tests = [{
      value: record.name,
      expectedResult: true,
      description: 'value matches the record name',
    }, {
      value: 'Do',
      expectedResult: true,
      description: 'value matches the record name partially',
    }, {
      value: '',
      expectedResult: true,
      description: 'value is empty',
    }, {
      value: 'JOHN',
      expectedResult: false,
      description: 'value does not match the record name (case-sensitive)',
    }, {
      value: 'York',
      expectedResult: false,
      description: 'value does not match the record name',
    }]
    it.each(tests)('should return $expectedResult when $description', ({
      value,
      expectedResult,
    }) => {
      const result = filterRecordByKeyCallback(record, key, value)

      expect(result).toBe(expectedResult)
    })
  })
})

