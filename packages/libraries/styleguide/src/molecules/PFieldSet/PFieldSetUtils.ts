import { get } from 'lodash-es'
import type { PFieldProps } from '../PField/PFieldTypes'

export function getInternalFields<T>(
  fields: PFieldProps<any>[],
  model: T,
  pReadonly: boolean,
  disabledFieldKeys: string[],
) {
  return fields
    .map((field) => ({
      ...field,
      pReadonly: pReadonly || field.pReadonly,
      pDisabled: pReadonly || field.pDisabled || disabledFieldKeys.includes(field.pFieldKey),
      modelValue: get(model, field.pFieldKey),
    }))
}
