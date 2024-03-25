import { get } from 'lodash-es'
import type { PFieldProps } from '../PField/PFieldTypes'

export function getInternalFields<T>(
  fields: PFieldProps<any>[],
  model: T,
  pReadonly: boolean,
) {
  return fields
    .map((field) => ({
      ...field,
      pReadonly: pReadonly || field.pReadonly,
      pDisabled: pReadonly || field.pDisabled,
      modelValue: get(model, field.pFieldKey),
    }))
}
