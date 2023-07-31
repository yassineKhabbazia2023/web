export const getFileExtension = (filename: string): string => {
  // Find the last occurrence of the dot in the filename
  const lastDotIndex = filename.lastIndexOf('.')

  // Check if a dot exists in the filename and it is not at the end of the filename
  if (lastDotIndex !== -1 && lastDotIndex !== filename.length - 1) {
    // Extract the extension using substring
    const extension = filename.substring(lastDotIndex + 1)
    return extension
  }

  // If the filename doesn't have a valid extension, return an empty string
  return ''
}
