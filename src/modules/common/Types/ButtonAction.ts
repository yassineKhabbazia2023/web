type ComponentType = 'UPLOAD' | 'SEARCH'

export interface ButtonAction {
  buttonName: string
  buttonType: string
  buttonIcon: string
  buttonActionName: string
  plain: boolean
  round: boolean
  circle: boolean
  loading: boolean
  disabled: boolean
  size: string
  componentType?: ComponentType
  multiple?: boolean
}
