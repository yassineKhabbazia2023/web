export function getFileExtension(filename?: string) {
  const lastDotIndex = filename?.lastIndexOf('.') ?? -1

  return (filename && lastDotIndex > 0)
    ? filename.slice(lastDotIndex + 1)
    : ''
}
