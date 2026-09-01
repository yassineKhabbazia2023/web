import type { UploadFile } from 'element-plus'
import { isNullOrEmpty, isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { BYTES_PER_MEGABYTE } from './PUpload.constants'
import type { FileRejectionOptions } from './PUploadTypes'

// Identity comparison is intentional: the same native File instance flows
// between the model and the internal element-plus file list.
export const isSameFileList = (firstList: File[], secondList: File[]): boolean =>
  firstList.length === secondList.length
  && firstList.every((file, index) => file === secondList[index])

const isMatchingAcceptedType = (acceptedType: string, fileExtension: string, fileMimeType: string): boolean => {
  if (acceptedType.startsWith('.')) {
    return fileExtension === acceptedType.toLowerCase()
  }

  if (acceptedType.endsWith('/*')) {
    return fileMimeType.toLowerCase().startsWith(acceptedType.slice(0, -1).toLowerCase())
  }

  return fileMimeType.toLowerCase() === acceptedType.toLowerCase()
}

export const isFileAccepted = (file: UploadFile, accept: string | undefined): boolean => {
  if (isNullOrEmpty(accept)) {
    return true
  }

  const acceptedTypes = accept
    .split(',')
    .map((acceptedType) => acceptedType.trim())
    .filter((acceptedType) => isNotNullNorEmpty(acceptedType))

  if (acceptedTypes.length === 0) {
    return true
  }

  const lastDotIndex = file.name.lastIndexOf('.')
  const fileExtension = lastDotIndex > 0 ? file.name.slice(lastDotIndex).toLowerCase() : ''
  const fileMimeType = file.raw?.type ?? ''

  return acceptedTypes.some((acceptedType) => isMatchingAcceptedType(acceptedType, fileExtension, fileMimeType))
}

export const isFileSizeValid = (file: UploadFile, maxFileSizeInMo: number | undefined): boolean => {
  if (maxFileSizeInMo === undefined || maxFileSizeInMo === null) {
    return true
  }

  const fileSizeInBytes = file.size ?? file.raw?.size ?? 0

  return fileSizeInBytes <= maxFileSizeInMo * BYTES_PER_MEGABYTE
}

// Single source of truth for the rejection reason: the unsupported-extension
// message takes precedence over the oversized-file message.
export const getFileRejectionMessage = (file: UploadFile, options: FileRejectionOptions): string | undefined => {
  if (isFileAccepted(file, options.accept) === false) {
    return options.rejectedFileMessage
  }

  if (isFileSizeValid(file, options.maxFileSizeInMo) === false) {
    return options.oversizedFileMessage
  }

  return undefined
}
