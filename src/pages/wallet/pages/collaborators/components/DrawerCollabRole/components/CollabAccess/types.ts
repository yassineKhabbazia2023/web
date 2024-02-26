export interface Props {
  selectedCollabRole: string
}

interface Access {
  id: number
  name: string
  selected: boolean
}

export interface State {
  isLoading: boolean | undefined
  accesses: Access[] | undefined
}
