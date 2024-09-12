// Takes ['a', 'splitted', 'path']
// Outputs 'a > splitted > path
export const getPathFromArray = (pathPieces: string[], pathSeparator = '>'): string => {
  if (!pathPieces || pathPieces.length === 0) return ''
  return pathPieces.join(` ${pathSeparator} `)
}
