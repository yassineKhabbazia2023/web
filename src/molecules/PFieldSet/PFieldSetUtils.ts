import type { PFieldProps } from '../PField/PFieldTypes'

export function getInternalFields(
  fields: PFieldProps<any>[],
  model: Record<string, any>,
  pReadonly: boolean
) {
  return fields
    .map((field) => ({
      ...field,
      pReadonly: pReadonly || field.pReadonly,
      pDisabled: pReadonly || field.pDisabled,
      modelValue: model[field.pFieldKey]
    }))
}
