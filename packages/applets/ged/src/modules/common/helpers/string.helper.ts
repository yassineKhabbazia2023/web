export function getContentBeforeAndAfterSeparator(content: string, separator: string = '/'): [string, string] {
  const slashIndex = content.indexOf(separator)
  if (slashIndex === -1) {
    return [content, '']
  }
  const before = content.substring(0, slashIndex)
  const after = content.substring(slashIndex + 1)
  return [before, after]
}