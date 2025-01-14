import type { FileExtension } from '@pulse/core/types'
import {
  getFileExtension,
} from '@pulse/core'
import type { IconName } from '../types/IconName.types'

const fileNameByExtension = new Map<FileExtension, IconName>([
  ['bmp', 'filetypeBmp'],
  ['csv', 'filetypeCsv'],
  ['doc', 'filetypeDoc'],
  ['docx', 'filetypeDocx'],
  ['gif', 'filetypeGif'],
  ['heic', 'filetypeHeic'],
  ['jpg', 'filetypeJpg'],
  ['md', 'filetypeMd'],
  ['pdf', 'filetypePdf'],
  ['png', 'filetypePng'],
  ['ppt', 'filetypePpt'],
  ['pptx', 'filetypePptx'],
  ['raw', 'filetypeRaw'],
  ['svg', 'filetypeSvg'],
  ['tiff', 'filetypeTiff'],
  ['txt', 'filetypeTxt'],
  ['xls', 'filetypeXls'],
  ['xlsx', 'filetypeXlsx'],
  ['xml', 'filetypeXml'],
])

export const getIconFileName = (fileExtension: FileExtension | undefined, defaultIconName: IconName): IconName => {
  const iconName = (fileExtension && fileNameByExtension.has(fileExtension))
    ? fileNameByExtension.get(fileExtension)
    : undefined

  return iconName ?? defaultIconName
}

export const getIconName = (fileName: string, defaultIconName: IconName): IconName => {
  const fileExtension = getFileExtension(fileName)
  const iconName = getIconFileName(fileExtension, defaultIconName)

  return iconName
}
