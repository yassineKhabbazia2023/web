import {
  IMAGE_EXTENSIONS,
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

export const isPdfDocument = (extension: string): boolean => {
  return extension.toLowerCase() === 'pdf'
}

