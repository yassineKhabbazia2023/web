import { addIfNotExists, removeIfExists } from './array.utils'

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
})