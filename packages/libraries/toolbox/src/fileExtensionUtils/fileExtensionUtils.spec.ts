import { describe, it, expect } from 'vitest'
import {
  getFileExtension,
  isImageDocument,
  getDocumentNameWithoutExtension,
  isExtensionAuthorized,
  isPdfDocument,
} from './fileExtensionUtils'

const filename1 = 'something.abc.txt'
const filename2 = 'file_without_extension'
const filename3 = 'another.file.with.multiple.dots.jpg'

const fileExtension1 = 'txt'
const fileExtension2 = 'jpg'
const fileExtension3 = 'jpeg'
const fileExtension4 = 'raw'

describe('getFileExtension', () => {
  it('should return the correct file extension', () => {
    const filename1 = 'something.abc.txt'
    const filename2 = 'file_without_extension'
    const filename3 = 'another.file.with.multiple.dots.JPG'
    const emptyFilename = ''

    expect(getFileExtension(filename1)).toBe('txt')
    expect(getFileExtension(filename2)).toBeUndefined()
    expect(getFileExtension(filename3)).toBe('jpg')
    expect(getFileExtension(emptyFilename)).toBeUndefined()
    expect(getFileExtension()).toBeUndefined()
  })

  describe('isImageDocument', () => {
    it('should return true if the document is an image', () => {
      expect(isImageDocument(fileExtension1)).toBeFalsy()
      expect(isImageDocument(fileExtension2)).toBeTruthy()
      expect(isImageDocument(fileExtension3)).toBeTruthy()
    })
  })

  describe('getDocumentNameWithoutExtension', () => {
    it('should return the name of a document', () => {
      expect(getDocumentNameWithoutExtension(filename1)).toBe('something.abc')
      expect(getDocumentNameWithoutExtension(filename2)).toBe('file_without_extension')
      expect(getDocumentNameWithoutExtension(filename3)).toBe('another.file.with.multiple.dots')
    })
  })

  describe('isExtensionAuthorized', () => {
    it('should return true if the file extension is authorized', () => {
      expect(isExtensionAuthorized(fileExtension1)).toBeTruthy()
      expect(isExtensionAuthorized(fileExtension4)).toBeFalsy()
      expect(isExtensionAuthorized(fileExtension2)).toBeTruthy()
    })
  })

  describe('isPdfDocument', () => {
    it('should return true if the file extension is pdf', () => {
      expect(isPdfDocument(fileExtension1)).toBeFalsy()
      expect(isPdfDocument('pdf')).toBeTruthy()
    })
  })
})
