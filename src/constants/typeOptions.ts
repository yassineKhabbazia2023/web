export const typeOptions = [
  {
    label: 'primary',
    value: 'primary'
  },
  {
    label: 'white',
    value: 'white'
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
  }
] as const

export default typeOptions

export type TypeOptions = typeof typeOptions[number]['value']
