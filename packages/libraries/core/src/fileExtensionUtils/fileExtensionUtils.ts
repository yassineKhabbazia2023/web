import {
  IMAGE_EXTENSIONS,
  FILE_NAME_BY_EXTENSION,
  AUTHORIZED_EXTENSIONS,
} from './fileExtensionUtilsConst'

export function getFileExtension(filename?: string) {
  const lastDotIndex = filename?.lastIndexOf('.') ?? -1

  const extension = (filename && lastDotIndex > 0)
    ? filename.slice(lastDotIndex + 1)
    : ''

  return extension.toLowerCase()
}

export const isImageDocument = (extension: string): boolean => {
  return IMAGE_EXTENSIONS.includes(extension.toLowerCase())
}

export const getDocumentNameWithoutExtension = (filename: string): string => {
  const lastDotIndex = filename?.lastIndexOf('.') ?? -1

  return (filename && lastDotIndex > 0)
    ? filename.slice(0, lastDotIndex)
    : filename
}

export const isExtensionAuthorized = (extension: string): boolean => {
  return AUTHORIZED_EXTENSIONS.includes(extension.toLowerCase())
}

export const getIconFileName = (fileName: string, defaultIconName: string) => {
  const fileExtension = getFileExtension(fileName)

  return FILE_NAME_BY_EXTENSION[fileExtension] ?? defaultIconName
}
