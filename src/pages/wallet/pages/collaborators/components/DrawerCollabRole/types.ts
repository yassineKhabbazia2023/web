export interface Props {
  rowData: any
  hasDrawerOpened: boolean
}

export interface Role {
  id: number
  name: string
  description: string
  selected: boolean
}

interface FormValue {
  roleIdSelected: number | undefined
}

export interface State {
  formValue: FormValue
  isLoading: boolean | undefined
  roles: Role[]
}
