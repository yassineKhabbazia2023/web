import { describe, it, expect } from 'vitest'
import {
  getFileExtension,
  isImageDocument,
  getDocumentNameWithoutExtension,
  isExtensionAuthorized,
  getFileIcon,
} from '@styleguide/utils/fileExtension'
import {
  PIFiletypeJpg,
  PIFiletypeTxt,
  PIFiletypeNone,
  PIFiletypeBmp,
  PIFiletypeCsv,
  PIFiletypeDoc,
  PIFiletypeDocx,
  PIFiletypeGif,
  PIFiletypePdf,
  PIFiletypePng,
  PIFiletypePpt,
  PIFiletypeRaw,
  PIFiletypeSvg,
  PIFiletypeXls,
  PIFiletypeXlsx,
} from '@styleguide/atoms/PIcon/components'

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

describe('fileExtension', () => {
  describe('getFileExtension', () => {
    it('should return the correct file extension', () => {
      expect(getFileExtension(filename1)).toBe('txt')
      expect(getFileExtension(filename2)).toBe('')
      expect(getFileExtension(filename3)).toBe('jpg')
    })
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
  describe('getFileIcon', () => {
    it('should return the good icon for the extension', () => {
      expect(getFileIcon(filename1)).toBe(PIFiletypeTxt)
      expect(getFileIcon(filename2)).toBe(PIFiletypeNone)
      expect(getFileIcon(filename3)).toBe(PIFiletypeJpg)
      expect(getFileIcon(filename4)).toBe(PIFiletypeBmp)
      expect(getFileIcon(filename5)).toBe(PIFiletypeCsv)
      expect(getFileIcon(filename6)).toBe(PIFiletypeDoc)
      expect(getFileIcon(filename7)).toBe(PIFiletypeDocx)
      expect(getFileIcon(filename8)).toBe(PIFiletypeGif)
      expect(getFileIcon(filename9)).toBe(PIFiletypePdf)
      expect(getFileIcon(filename10)).toBe(PIFiletypePng)
      expect(getFileIcon(filename11)).toBe(PIFiletypePpt)
      expect(getFileIcon(filename12)).toBe(PIFiletypeRaw)
      expect(getFileIcon(filename13)).toBe(PIFiletypeSvg)
      expect(getFileIcon(filename14)).toBe(PIFiletypeXls)
      expect(getFileIcon(filename15)).toBe(PIFiletypeXlsx)
    })
  })
})
