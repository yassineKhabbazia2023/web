import type { UploadFile } from 'element-plus'
import { isFileAccepted, isFileSizeValid, getFileRejectionMessage, isSameFileList } from './PUploadUtils'
import { BYTES_PER_MEGABYTE } from './PUpload.constants'

const buildUploadFile = (name: string, mimeType: string): UploadFile => ({
  name,
  uid: 1,
  status: 'ready',
  raw: {
    name,
    type: mimeType,
    uid: 1,
  } as UploadFile['raw'],
})

const buildSizedUploadFile = (size: number | undefined, rawSize?: number): UploadFile => ({
  name: 'document.pdf',
  uid: 1,
  status: 'ready',
  size,
  raw: {
    name: 'document.pdf',
    type: 'application/pdf',
    uid: 1,
    size: rawSize,
  } as UploadFile['raw'],
})

describe('isFileAccepted', () => {
  describe('when accept is empty', () => {
    it('should accept any file when accept is undefined', () => {
      expect(isFileAccepted(buildUploadFile('document.exe', 'application/x-msdownload'), undefined)).toBe(true)
    })

    it('should accept any file when accept is an empty string', () => {
      expect(isFileAccepted(buildUploadFile('document.exe', 'application/x-msdownload'), '')).toBe(true)
    })

    it('should accept any file when accept only contains separators', () => {
      expect(isFileAccepted(buildUploadFile('document.exe', 'application/x-msdownload'), ' , ,')).toBe(true)
    })
  })

  describe('when accept contains extensions', () => {
    it('should accept a file with an allowed extension', () => {
      expect(isFileAccepted(buildUploadFile('document.pdf', 'application/pdf'), '.pdf')).toBe(true)
    })

    it('should reject a file with a disallowed extension', () => {
      expect(isFileAccepted(buildUploadFile('document.exe', 'application/x-msdownload'), '.pdf')).toBe(false)
    })

    it('should accept a file matching one of multiple extensions', () => {
      expect(isFileAccepted(buildUploadFile('photo.png', 'image/png'), '.pdf, .png, .jpg')).toBe(true)
    })

    it('should be case insensitive on the file extension', () => {
      expect(isFileAccepted(buildUploadFile('DOCUMENT.PDF', 'application/pdf'), '.pdf')).toBe(true)
    })

    it('should be case insensitive on the accepted extension', () => {
      expect(isFileAccepted(buildUploadFile('document.pdf', 'application/pdf'), '.PDF')).toBe(true)
    })

    it('should reject a file without extension', () => {
      expect(isFileAccepted(buildUploadFile('document', ''), '.pdf')).toBe(false)
    })

    it('should only match the last extension of the file name', () => {
      expect(isFileAccepted(buildUploadFile('document.pdf.exe', 'application/x-msdownload'), '.pdf')).toBe(false)
    })
  })

  describe('when accept contains mime types', () => {
    it('should accept a file with an allowed mime type', () => {
      expect(isFileAccepted(buildUploadFile('photo.png', 'image/png'), 'image/png, image/jpeg')).toBe(true)
    })

    it('should reject a file with a disallowed mime type', () => {
      expect(isFileAccepted(buildUploadFile('document.pdf', 'application/pdf'), 'image/png, image/jpeg')).toBe(false)
    })

    it('should accept a file matching a wildcard mime type', () => {
      expect(isFileAccepted(buildUploadFile('photo.png', 'image/png'), 'image/*')).toBe(true)
    })

    it('should reject a file not matching a wildcard mime type', () => {
      expect(isFileAccepted(buildUploadFile('document.pdf', 'application/pdf'), 'image/*')).toBe(false)
    })
  })

  describe('when accept mixes extensions and mime types', () => {
    it('should accept a file matching the extension part', () => {
      expect(isFileAccepted(buildUploadFile('document.pdf', 'application/pdf'), 'image/*, .pdf')).toBe(true)
    })

    it('should accept a file matching the mime type part', () => {
      expect(isFileAccepted(buildUploadFile('photo.jpeg', 'image/jpeg'), 'image/*, .pdf')).toBe(true)
    })

    it('should reject a file matching neither part', () => {
      expect(isFileAccepted(buildUploadFile('archive.zip', 'application/zip'), 'image/*, .pdf')).toBe(false)
    })
  })
})

describe('isFileSizeValid', () => {
  it('should accept any file when no limit is provided', () => {
    expect(isFileSizeValid(buildSizedUploadFile(50 * BYTES_PER_MEGABYTE), undefined)).toBe(true)
  })

  it('should accept a file smaller than the limit', () => {
    expect(isFileSizeValid(buildSizedUploadFile(2 * BYTES_PER_MEGABYTE), 5)).toBe(true)
  })

  it('should accept a file exactly at the limit', () => {
    expect(isFileSizeValid(buildSizedUploadFile(5 * BYTES_PER_MEGABYTE), 5)).toBe(true)
  })

  it('should reject a file larger than the limit', () => {
    expect(isFileSizeValid(buildSizedUploadFile(6 * BYTES_PER_MEGABYTE), 5)).toBe(false)
  })

  it('should support decimal megabyte limits', () => {
    expect(isFileSizeValid(buildSizedUploadFile(0.6 * BYTES_PER_MEGABYTE), 0.5)).toBe(false)
  })

  it('should fall back to the raw file size when the upload size is missing', () => {
    expect(isFileSizeValid(buildSizedUploadFile(undefined, 6 * BYTES_PER_MEGABYTE), 5)).toBe(false)
  })
})

describe('getFileRejectionMessage', () => {
  const buildOptions = (overrides = {}) => ({
    accept: '.pdf',
    maxFileSizeInMo: 5,
    rejectedFileMessage: 'Extension non supportée',
    oversizedFileMessage: 'Fichier trop volumineux',
    ...overrides,
  })

  it('should return undefined when the file is accepted and within the size limit', () => {
    expect(getFileRejectionMessage(buildSizedUploadFile(2 * BYTES_PER_MEGABYTE), buildOptions())).toBeUndefined()
  })

  it('should return the rejected file message when the extension is not accepted', () => {
    const file = buildUploadFile('archive.zip', 'application/zip')
    expect(getFileRejectionMessage(file, buildOptions())).toBe('Extension non supportée')
  })

  it('should return the oversized message when the file is too large', () => {
    const file = buildSizedUploadFile(6 * BYTES_PER_MEGABYTE)
    expect(getFileRejectionMessage(file, buildOptions())).toBe('Fichier trop volumineux')
  })

  it('should prioritize the extension message over the size message', () => {
    const file = { ...buildUploadFile('archive.zip', 'application/zip'), size: 6 * BYTES_PER_MEGABYTE }
    expect(getFileRejectionMessage(file, buildOptions())).toBe('Extension non supportée')
  })
})

describe('isSameFileList', () => {
  const firstFile = new File(['content'], 'first.pdf', { type: 'application/pdf' })
  const secondFile = new File(['content'], 'second.pdf', { type: 'application/pdf' })

  it('should return true for two lists holding the same File instances in order', () => {
    expect(isSameFileList([firstFile, secondFile], [firstFile, secondFile])).toBe(true)
  })

  it('should return true for two empty lists', () => {
    expect(isSameFileList([], [])).toBe(true)
  })

  it('should return false when lengths differ', () => {
    expect(isSameFileList([firstFile], [firstFile, secondFile])).toBe(false)
  })

  it('should return false when the order differs', () => {
    expect(isSameFileList([firstFile, secondFile], [secondFile, firstFile])).toBe(false)
  })

  it('should return false for equal-looking but distinct File instances', () => {
    const cloneOfFirstFile = new File(['content'], 'first.pdf', { type: 'application/pdf' })

    expect(isSameFileList([firstFile], [cloneOfFirstFile])).toBe(false)
  })
})
