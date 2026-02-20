export type ValueType = string | number | boolean

export interface PatchValue {
  path: string
  originalValue: ValueType
  newValue: ValueType
}

export interface PatchOperation {
  op: 'replace'
  path: string
  value: ValueType
}
