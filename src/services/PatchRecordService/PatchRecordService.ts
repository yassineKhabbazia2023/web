import type { PatchValue, PatchOperation, ValueType } from './PatchRecordServiceTypes'

export function addPathValue(
  patchValues: PatchValue[],
  fieldKey: string,
  previousValue: ValueType,
  newValue: ValueType
) {
  const path = `/${fieldKey.replace(/\./g, '/')}`
  const patchValueIndex = patchValues.findIndex(({ path: _path }) => path === _path)
  if (patchValueIndex >= 0) {
    const patchValue = patchValues[patchValueIndex]
    if (patchValue.originalValue === newValue) {
      patchValues.splice(patchValueIndex, 1)
    } else {
      patchValue.newValue = newValue
    }
  } else {
    patchValues.push({
      path,
      originalValue: previousValue,
      newValue
    })
  }
}

export function getPatchOperations(patchValues: PatchValue[]) {
  return patchValues.map<PatchOperation>(({ path, newValue: value }) => ({
    op: 'replace',
    path,
    value
  }))
}
