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
  isImageDocument as coreIsImageDocument,
  getDocumentNameWithoutExtension as coreGetDocumentNameWithoutExtension,
  isExtensionAuthorized as coreIsExtensionAuthorized,
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

export const isExtensionAuthorized = (extension: string): boolean => coreIsExtensionAuthorized(extension)

export const getFileIcon = (fileName: string) => {
  const iconFileName = getIconFileName(fileName, 'filetypeNone')

  return ICON_COMPONENT_BY_FILE_NAME[iconFileName] ?? PIFiletypeNone
}
