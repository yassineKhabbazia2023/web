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
