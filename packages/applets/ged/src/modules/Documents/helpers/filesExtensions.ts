import { type Component } from 'vue'
import {
  PIFileText,
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
} from '@pulse/styleguide/components'
import {
  isImageDocument as coreIsImageDocument,
  getDocumentNameWithoutExtension as coreGetDocumentNameWithoutExtension,
  getIconFileName,
} from '@pulse/core'

const ICON_COMPONENT_BY_FILE_NAME: Record<string, Component> = {
  filetypeNone: PIFiletypeNone,
  filetypeBmp: PIFiletypeBmp,
  filetypeCsv: PIFiletypeCsv,
  filetypeDoc: PIFiletypeDoc,
  filetypeDocx: PIFiletypeDocx,
  filetypeGif: PIFiletypeGif,
  filetypeHeic: PIFiletypeHeic,
  filetypeJpg: PIFiletypeJpg,
  filetypeMd: PIFiletypeMd,
  filetypePdf: PIFiletypePdf,
  filetypePng: PIFiletypePng,
  filetypePpt: PIFiletypePpt,
  filetypePptx: PIFiletypePptx,
  filetypeRaw: PIFiletypeRaw,
  filetypeSvg: PIFiletypeSvg,
  filetypeTiff: PIFiletypeTiff,
  filetypeTxt: PIFiletypeTxt,
  filetypeXls: PIFiletypeXls,
  filetypeXlsx: PIFiletypeXlsx,
  filetypeXml: PIFiletypeXml,
}

export const isImageDocument = (extension: string): boolean => coreIsImageDocument(extension)

export const getDocumentNameWithoutExtension = (filename: string): string => coreGetDocumentNameWithoutExtension(filename)

export const getFileIcon = (fileName: string) => {
  const iconFileName = getIconFileName(fileName, 'fileText')

  return ICON_COMPONENT_BY_FILE_NAME[iconFileName] ?? PIFileText
}
