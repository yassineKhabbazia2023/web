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

export const FILE_NAME_BY_EXTENSION: Record<string, IconName> = {
  'bmp': 'filetypeBmp',
  'csv': 'filetypeCsv',
  'doc': 'filetypeDoc',
  'docx': 'filetypeDocx',
  'gif': 'filetypeGif',
  'heic': 'filetypeHeic',
  'jpg': 'filetypeJpg',
  'md': 'filetypeMd',
  'pdf': 'filetypePdf',
  'png': 'filetypePng',
  'ppt': 'filetypePpt',
  'pptx': 'filetypePptx',
  'raw': 'filetypeRaw',
  'svg': 'filetypeSvg',
  'tiff': 'filetypeTiff',
  'txt': 'filetypeTxt',
  'xls': 'filetypeXls',
  'xlsx': 'filetypeXlsx',
  'xml': 'filetypeXml',
}

export const getIconFileName = (fileExtension: string, defaultIconName: IconName): IconName => {
  return FILE_NAME_BY_EXTENSION[fileExtension] ?? defaultIconName
}

export const getFileIcon = (fileName: string) => {
  const fileExtension = getFileExtension(fileName)
  const iconFileName = getIconFileName(fileExtension, 'filetypeNone')

  return iconComponentByIconFileName.has(iconFileName)
    ? iconComponentByIconFileName.get(iconFileName)
    : PIFiletypeNone
}
