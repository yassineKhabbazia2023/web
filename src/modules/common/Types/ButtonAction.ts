type ComponentType = 'UPLOAD' | 'SEARCH'

export interface ButtonAction {
  buttonName: string
  buttonType?: 'default'
  | 'primary'
  | 'white'
  | 'generic'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  buttonIcon: string
  buttonActionName: string
  plain: boolean
  round: boolean
  circle: boolean
  loading: boolean
  disabled: boolean
  size?: 'default' | 'small'
  componentType?: ComponentType
  multiple?: boolean
}
