import type { PFieldProps } from '../PField/PFieldTypes'

export interface PFieldSetProps<T> {
  pModel: T
  pFields: PFieldProps<any>[]
  pReadonly?: boolean
}
