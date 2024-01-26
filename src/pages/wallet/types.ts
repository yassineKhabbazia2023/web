export interface IEntity {
  isFavorite: boolean
  name: string
  accountNumber: string
  owner: {
    firstName: string
    lastName: string
  }
  city: string
  deploymentStatus: number
}

export interface IState {
  data: IEntity[]
  currentPage: number
  limit: number
  totalPage: number | undefined
  totalItems: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
  filterByDeploymentStatus: string | undefined
}

export interface ICommonEntitiesInFavorite {
  name: string
  id: string
}
