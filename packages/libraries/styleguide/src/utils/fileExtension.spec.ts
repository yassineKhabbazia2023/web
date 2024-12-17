import { describe, it, expect } from 'vitest'
import {
  getIconFileName,
  getFileIcon,
} from '../utils/fileExtension'
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
} from '../atoms/PIcon/components'

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

describe('fileExtension', () => {
  describe('getIconFileName', () => {
    it('should return the good icon for the extension', () => {
      expect(getIconFileName('txt', 'filetypeNone')).toBe('filetypeTxt')
      expect(getIconFileName('', 'filetypeNone')).toBe('filetypeNone')
      expect(getIconFileName('jpg', 'filetypeNone')).toBe('filetypeJpg')
      expect(getIconFileName('bmp', 'filetypeNone')).toBe('filetypeBmp')
      expect(getIconFileName('csv', 'filetypeNone')).toBe('filetypeCsv')
      expect(getIconFileName('doc', 'filetypeNone')).toBe('filetypeDoc')
      expect(getIconFileName('docx', 'filetypeNone')).toBe('filetypeDocx')
      expect(getIconFileName('gif', 'filetypeNone')).toBe('filetypeGif')
      expect(getIconFileName('pdf', 'filetypeNone')).toBe('filetypePdf')
      expect(getIconFileName('png', 'filetypeNone')).toBe('filetypePng')
      expect(getIconFileName('ppt', 'filetypeNone')).toBe('filetypePpt')
      expect(getIconFileName('raw', 'filetypeNone')).toBe('filetypeRaw')
      expect(getIconFileName('svg', 'filetypeNone')).toBe('filetypeSvg')
      expect(getIconFileName('xls', 'filetypeNone')).toBe('filetypeXls')
      expect(getIconFileName('xlsx', 'filetypeNone')).toBe('filetypeXlsx')
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
