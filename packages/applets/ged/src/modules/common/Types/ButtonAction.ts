import type { PButtonProps } from '@pulse/styleguide/types'
type ComponentType = 'UPLOAD' | 'SEARCH'

export interface ButtonAction {
  buttonName: string
  buttonType?: PButtonProps['pType']
  buttonIcon: string
  buttonActionName: string
  plain: boolean
  round: boolean
  circle: boolean
  loading: boolean
  disabled: boolean
  size?: PButtonProps['pSize']
  componentType?: ComponentType
  multiple?: boolean
}
