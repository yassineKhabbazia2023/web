import type { PFieldProps } from '../PField/PFieldTypes'

export interface PDynamicFieldsProps<T> {
  pModel: T
  pFields: PFieldProps<any>[]
  pReadonly?: boolean
}
