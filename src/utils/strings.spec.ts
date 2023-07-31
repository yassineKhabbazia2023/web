import { describe, it, expect } from 'vitest'
import { getFileExtension } from '@/utils/strings'

describe('strings', () => {
  describe('getFileExtension', () => {
    it('should return the correct file extension', () => {
      const filename1 = 'something.abc.txt'
      const filename2 = 'file_without_extension'
      const filename3 = 'another.file.with.multiple.dots.jpg'

      expect(getFileExtension(filename1)).toBe('txt')
      expect(getFileExtension(filename2)).toBe('')
      expect(getFileExtension(filename3)).toBe('jpg')
    })
  })
})
