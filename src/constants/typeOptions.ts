import type { EpPropMergeType } from 'element-plus/es/utils'

export const typeOptions = [
  {
    label: 'default',
    value: '',
  },
  {
    label: 'primary',
    value: 'primary',
  },
  {
    label: 'white',
    value: 'white',
  },
  {
    label: 'generic',
    value: 'generic',
  },
  {
    label: 'success',
    value: 'success',
  },
  {
    label: 'warning',
    value: 'warning',
  },
  {
    label: 'danger',
    value: 'danger',
  },
  {
    label: 'info',
    value: 'info',
  },
]

export default typeOptions

export type TypeOptions = typeof typeOptions[number]['value']

export const groupOptions = [
  {
    label: 'empty',
    value: '',
  },
  {
    label: 'text',
    value: 'text',
  },
  {
    label: 'primary',
    value: 'primary',
  },
  {
    label: 'default',
    value: 'default',
  },
  {
    label: 'success',
    value: 'success',
  },
  {
    label: 'warning',
    value: 'warning',
  },
  {
    label: 'danger',
    value: 'danger',
  },
  {
    label: 'info',
    value: 'info',
  },
]

export type GroupTypeOptions = EpPropMergeType<
  StringConstructor,
  '' | 'default' | 'text' | 'primary' | 'success' | 'warning' | 'danger' | 'info',
  unknown
> | undefined
