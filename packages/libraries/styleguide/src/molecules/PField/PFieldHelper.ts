import type { PFieldRadioOptions } from './PFieldTypes'

type TOrArray<T> = T | T[] | undefined

export function getModelValueAsArray<T>(
  modelValue: TOrArray<T>,
) {
  return Array.isArray(modelValue) ? [...modelValue] : []
}

export function getInternalCheckboxOptions<T>(
  modelValue: TOrArray<T>,
  pOptions: PFieldRadioOptions[],
) {
  const modelValueArray = getModelValueAsArray<T>(modelValue)

  return pOptions
    ?.map(({ pValue: value, pLabel: label }) => {
      const isChecked = modelValueArray.includes(value as T)

      return {
        isChecked,
        label,
      }
    })
}

export function getModelValueOnCheckboxChange<T>(
  modelValue: TOrArray<T>,
  pOptions: PFieldRadioOptions[],
  optionIndex: number,
  isChecked: boolean,
) {
  const option = pOptions?.at(optionIndex)
  const value = option?.pValue as T
  const modelValueArray = getModelValueAsArray<T>(modelValue)

  if (isChecked && !modelValueArray.includes(value)) {
    modelValueArray.push(value)
    return modelValueArray
  }
  if (!isChecked && modelValueArray.includes(value)) {
    const index = modelValueArray.indexOf(value)
    modelValueArray.splice(index, 1)
    return modelValueArray
  }
}
