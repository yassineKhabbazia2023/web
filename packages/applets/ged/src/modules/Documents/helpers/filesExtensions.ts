import {
  PIFileText,
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
} from '@pulse/styleguide'
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
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'bmp', 'webp', 'svg', 'ico', 'cur']
  return imageExtensions.includes(extension.toLowerCase())
}

export const getDocumentNameExtension = (filename: string): string => {
  const parts = filename.split('.')
  return parts[parts.length - 1]
}

export const getDocumentNameWithoutExtension = (filename: string): string => {
  const parts = filename.split('.')
  if (parts.length < 2) return filename

  parts.pop()
  return parts.join('.')
}

export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === 0 || lastDotIndex === filename.length - 1) {
    return ''
  }
  return filename.slice(lastDotIndex + 1)
}

export const isExtensionAuthorized = (extension: string): boolean => {
  return authorizedExtensions.includes(extension.toLocaleLowerCase())
}

export const getFileIcon = (fileName: string) => {
  if (!fileName || !fileName.trim().length) return PIFileText
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
      return PIFileText
  }
}
