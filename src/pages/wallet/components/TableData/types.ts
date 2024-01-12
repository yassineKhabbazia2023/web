export interface Props {
  data: any,
  handleAddFavorite: Function
}

export interface Row {
  id: string
  name: string
}

export interface PToolboxItemProps {
  pValue: string
  pIconName?: string
  disabled?: boolean
  pActionName?: string
  pState?: 'default' | 'danger'
}
