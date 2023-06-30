export const typeOptions = [
  {
    label: 'default',
    value: ''
  },
  {
    label: 'primary',
    value: 'primary'
  },
  {
    label: 'success',
    value: 'success'
  },
  {
    label: 'warning',
    value: 'warning'
  },
  {
    label: 'danger',
    value: 'danger'
  },
  {
    label: 'info',
    value: 'info'
  },
  {
    label: 'primary-persian',
    value: 'primary-persian'
  },
  {
    label: 'secondary-fushia',
    value: 'secondary-fushia'
  },
  {
    label: 'secondary-amethyste',
    value: 'secondary-amethyste'
  },
  {
    label: 'secondary-cyan',
    value: 'secondary-cyan'
  }
] as const

export default typeOptions

export type TypeOptions = typeof typeOptions[number]['value']
