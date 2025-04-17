import { addIfNotExists, removeIfExists, arrayIncludes } from './array.utils'

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
      const array = [1, 2, 3]
      const value = 2
      expect(arrayIncludes(array, value)).toBe(true)
    })

    it('should return false if the array does not include the single value', () => {
      const array = [1, 2, 3]
      const value = 4
      expect(arrayIncludes(array, value)).toBe(false)
    })

    it('should return true if the array includes all values in the array of values', () => {
      const array = [1, 2, 3, 4]
      const value = [2, 3]
      expect(arrayIncludes(array, value)).toBe(true)
    })

    it('should return false if the array does not include all values in the array of values', () => {
      const array = [1, 2, 3, 4]
      const value = [0, 5]
      expect(arrayIncludes(array, value)).toBe(false)
    })
  })
})
