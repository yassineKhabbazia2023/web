import { Component } from 'vue'

export interface IEntity {
  isFavorite: boolean
  name: string
  accountNumber: string
  owner: {
    firstName: string
    lastName: string
    email: string | null
    initials: string | undefined
    avatarColor: string
  }
  id: string
  hub: string
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

export interface IWalletData {
  owner: {
    firstName: string
    lastName: string
    email: string | null
    initials: string | undefined
    avatarColor: string
  }
  city: string
  hub: string
  deploymentStatus: {
    text: string
    icon: Component
    color: string
  },
  id: string
  accountNumber: string
  name: string
  isFavorite: boolean
}
