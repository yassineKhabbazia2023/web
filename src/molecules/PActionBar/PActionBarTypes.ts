type ComponentType = 'UPLOAD' | 'SEARCH'

export interface ComponentDefinitionProps {
  buttonName: string
  buttonType: string
  buttonIcon: string
  buttonActionName: string
  size: string
  plain: boolean
  round: boolean
  circle: boolean
  loading: boolean
  disabled: boolean
  componentType?: ComponentType
  multiple?: boolean
}

export interface PActionBarProps {
  rightSideButtons: ComponentDefinitionProps[]
  leftSideButtons: ComponentDefinitionProps[]
}
