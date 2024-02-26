export interface Role {
  id: number
  name: string
  description: string
  selected: boolean
}

export type selectedRoleId = number | undefined

interface FormValue {
  selectedRoleId: selectedRoleId
}

export interface State {
  formValue: FormValue
  isLoading: boolean | undefined
  roles: Role[]
}
