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
const authorizedExtensions = [
  'bmp',
  'csv',
  'doc',
  'dot',
  'docx',
  'dotx',
  'docm',
  'dotm',
  'gif',
  'jfif',
  'jpe',
  'jpeg',
  'jpg',
  'msg',
  'mp4',
  'pdf',
  'ppt',
  'pptx',
  'pot',
  'pps',
  'ppa',
  'ppam',
  'png',
  'rtf',
  'sql',
  'tif',
  'tiff',
  'txt',
  'vsdx',
  'xsl',
  'xls',
  'xlsx',
  'xltx',
  'xlsm',
  'xltm',
  'xlam',
  'xlsb',
  'zip',
  'rar',
  'xml',
  'pbix',
  'ods',
  'one',
  'onea',
  'onetoc',
  'onetoc2',
  'onetmp',
  'onepkg',
]
export const imageExtensions =
  ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'bmp', 'webp', 'svg', 'ico', 'cur']

export const isImageDocument = (extension: string): boolean => {
  return imageExtensions.includes(extension.toLowerCase())
}

export const getDocumentNameWithoutExtension = (filename: string): string => {
  const parts = filename.split('.')
  if (parts.length < 2) {
    return filename
  }

  parts.pop()
  return parts.join('.')
}

export const isExtensionAuthorized = (extension: string): boolean => {
  return authorizedExtensions.includes(extension)
}

export const getFileIcon = (fileName: string) => {
  if (!fileName?.trim().length) {
    return PIFiletypeNone
  }
  switch (fileName.split('.').pop()) {
  case 'bmp':
    return PIFiletypeBmp
  case 'csv':
    return PIFiletypeCsv
  case 'doc':
    return PIFiletypeDoc
  case 'docx':
    return PIFiletypeDocx
  case 'gif':
    return PIFiletypeGif
  case 'heic':
    return PIFiletypeHeic
  case 'jpg':
    return PIFiletypeJpg
  case 'md':
    return PIFiletypeMd
  case 'pdf':
    return PIFiletypePdf
  case 'png':
    return PIFiletypePng
  case 'ppt':
    return PIFiletypePpt
  case 'pptx':
    return PIFiletypePptx
  case 'raw':
    return PIFiletypeRaw
  case 'svg':
    return PIFiletypeSvg
  case 'tiff':
    return PIFiletypeTiff
  case 'txt':
    return PIFiletypeTxt
  case 'xls':
    return PIFiletypeXls
  case 'xlsx':
    return PIFiletypeXlsx
  case 'xml':
    return PIFiletypeXml
  default:
    return PIFiletypeNone
  }
}
