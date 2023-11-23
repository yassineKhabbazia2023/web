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
  'onepkg'
]

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

export const isExtensionAuthorized = (extension: string): boolean => {
  return authorizedExtensions.includes(extension)
}

