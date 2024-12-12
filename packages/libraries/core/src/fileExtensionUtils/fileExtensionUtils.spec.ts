import { describe, it, expect } from 'vitest'
import {
  getFileExtension,
  isImageDocument,
  getDocumentNameWithoutExtension,
  isExtensionAuthorized,
  getIconFileName,
  isPdfDocument,
} from './fileExtensionUtils'

const filename1 = 'something.abc.txt'
const filename2 = 'file_without_extension'
const filename3 = 'another.file.with.multiple.dots.jpg'
const filename4 = 'another.file.bmp'
const filename5 = 'another.csv'
const filename6 = 'file.doc'
const filename7 = 'file.docx'
const filename8 = 'file.gif'
const filename9 = 'file.pdf'
const filename10 = 'file.png'
const filename11 = 'file.ppt'
const filename12 = 'file.raw'
const filename13 = 'file.svg'
const filename14 = 'file.xls'
const filename15 = 'file.xlsx'

const fileExtension1 = 'txt'
const fileExtension2 = 'jpg'
const fileExtension3 = 'JPEG'
const fileExtension4 = 'xyz'

describe('getFileExtension', () => {
  it('should return the correct file extension', () => {
    const filename1 = 'something.abc.txt'
    const filename2 = 'file_without_extension'
    const filename3 = 'another.file.with.multiple.dots.JPG'
    const emptyFilename = ''

    expect(getFileExtension(filename1)).toBe('txt')
    expect(getFileExtension(filename2)).toBe('')
    expect(getFileExtension(filename3)).toBe('jpg')
    expect(getFileExtension(emptyFilename)).toBe('')
    expect(getFileExtension()).toBe('')
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

  describe('getIconFileName', () => {
    it('should return the good icon for the extension', () => {
      expect(getIconFileName(filename1, 'filetypeNone')).toBe('filetypeTxt')
      expect(getIconFileName(filename2, 'filetypeNone')).toBe('filetypeNone')
      expect(getIconFileName(filename3, 'filetypeNone')).toBe('filetypeJpg')
      expect(getIconFileName(filename4, 'filetypeNone')).toBe('filetypeBmp')
      expect(getIconFileName(filename5, 'filetypeNone')).toBe('filetypeCsv')
      expect(getIconFileName(filename6, 'filetypeNone')).toBe('filetypeDoc')
      expect(getIconFileName(filename7, 'filetypeNone')).toBe('filetypeDocx')
      expect(getIconFileName(filename8, 'filetypeNone')).toBe('filetypeGif')
      expect(getIconFileName(filename9, 'filetypeNone')).toBe('filetypePdf')
      expect(getIconFileName(filename10, 'filetypeNone')).toBe('filetypePng')
      expect(getIconFileName(filename11, 'filetypeNone')).toBe('filetypePpt')
      expect(getIconFileName(filename12, 'filetypeNone')).toBe('filetypeRaw')
      expect(getIconFileName(filename13, 'filetypeNone')).toBe('filetypeSvg')
      expect(getIconFileName(filename14, 'filetypeNone')).toBe('filetypeXls')
      expect(getIconFileName(filename15, 'filetypeNone')).toBe('filetypeXlsx')
    })
  })

  describe('isPdfDocument', () => {
    it('should return true if the file extension is pdf', () => {
      expect(isPdfDocument(fileExtension1)).toBeFalsy()
      expect(isPdfDocument('pdf')).toBeTruthy()
    })
  })
})
