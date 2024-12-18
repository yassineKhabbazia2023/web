import type { FileExtension } from '@pulse/core/types'
import { type Component } from 'vue'
import {
  PIFiletypeNone,
  PIFiletypeBmp,
  PIFiletypeCsv,
  PIFiletypeDoc,
  PIFiletypeDocx,
  PIFiletypeGif,
  PIFiletypeHeic,
  PIFiletypeJpg,
  PIFiletypeMd,
  PIFiletypePdf,
  PIFiletypePng,
  PIFiletypePpt,
  PIFiletypePptx,
  PIFiletypeRaw,
  PIFiletypeSvg,
  PIFiletypeTiff,
  PIFiletypeTxt,
  PIFiletypeXls,
  PIFiletypeXlsx,
  PIFiletypeXml,
} from '../atoms/PIcon/components'
import {
  getFileExtension,
} from '@pulse/core'
import type { IconName } from '../types/IconName.types'

const iconComponentByIconFileName = new Map<IconName, Component>([
  ['filetypeNone', PIFiletypeNone],
  ['filetypeBmp', PIFiletypeBmp],
  ['filetypeCsv', PIFiletypeCsv],
  ['filetypeDoc', PIFiletypeDoc],
  ['filetypeDocx', PIFiletypeDocx],
  ['filetypeGif', PIFiletypeGif],
  ['filetypeHeic', PIFiletypeHeic],
  ['filetypeJpg', PIFiletypeJpg],
  ['filetypeMd', PIFiletypeMd],
  ['filetypePdf', PIFiletypePdf],
  ['filetypePng', PIFiletypePng],
  ['filetypePpt', PIFiletypePpt],
  ['filetypePptx', PIFiletypePptx],
  ['filetypeRaw', PIFiletypeRaw],
  ['filetypeSvg', PIFiletypeSvg],
  ['filetypeTiff', PIFiletypeTiff],
  ['filetypeTxt', PIFiletypeTxt],
  ['filetypeXls', PIFiletypeXls],
  ['filetypeXlsx', PIFiletypeXlsx],
  ['filetypeXml', PIFiletypeXml],
])

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

export const getFileIcon = (fileName: string) => {
  const iconFileName = getIconName(fileName, 'filetypeNone')

  return iconComponentByIconFileName.has(iconFileName)
    ? iconComponentByIconFileName.get(iconFileName)
    : PIFiletypeNone
}
