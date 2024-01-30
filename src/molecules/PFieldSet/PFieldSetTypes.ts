import type { PFieldProps } from '../PField/PFieldTypes'

export interface PFieldSetProps {
  pModel: Record<string, any>
  pFields: PFieldProps<any>[]
  pReadonly?: boolean
}
