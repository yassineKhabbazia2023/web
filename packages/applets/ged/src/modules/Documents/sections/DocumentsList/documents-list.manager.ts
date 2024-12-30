export function getRowAlignmentClass(index: number, referenceTable: Array<any>) {
  return index + 1 === referenceTable.length ? 'right' : 'default'
}
