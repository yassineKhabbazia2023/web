import { FileExtension } from './fileExtensionTypes'

import {
  IMAGE_EXTENSIONS,
  AUTHORIZED_EXTENSIONS,
  KNOWN_FILE_EXTENSIONS,
} from './fileExtensionUtilsConst'

export function getFileExtension(filename?: string): FileExtension | undefined {
  const lastDotIndex = filename?.lastIndexOf('.') ?? -1

  const extension = (filename && lastDotIndex > 0)
    ? filename.slice(lastDotIndex + 1).toLowerCase()
    : undefined

  const fileExtension = extension ? KNOWN_FILE_EXTENSIONS[extension] : undefined

  return fileExtension
}

export const isImageDocument = (extension?: FileExtension): boolean => {
  return extension ? IMAGE_EXTENSIONS.includes(extension) : false
}

export const getDocumentNameWithoutExtension = (filename: string): string => {
  const lastDotIndex = filename?.lastIndexOf('.') ?? -1

  return (filename && lastDotIndex > 0)
    ? filename.slice(0, lastDotIndex)
    : filename
}

export const isExtensionAuthorized = (extension?: FileExtension): boolean => {
  return extension ? AUTHORIZED_EXTENSIONS.includes(extension) : false
}

export const isPdfDocument = (extension?: FileExtension): boolean => {
  return extension?.toLowerCase() === 'pdf'
}
