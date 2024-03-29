import type { QueryResult } from '@/types/commonTypes'
import type { PaginationData } from '@/helper/helperTypes'
import type { Component } from 'vue'

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

export interface IState extends PaginationData<IEntity> {
  totalPage: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
  filterByDeploymentStatus: string | undefined
}

export interface ICommonEntitiesInFavorite {
  name: string
  id: string
}

export interface DeploymentStatus {
  text: string
  icon: Component
  color: string
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
  deploymentStatus: DeploymentStatus
  id: string
  accountId?: number
  accountNumber: string
  name: string
  isFavorite: boolean
}

export interface SearchCriteria {
  currentPage: number
  limit: number
  search: string | undefined
  filterByDeploymentStatus: string | undefined
}

export interface SearchResult extends QueryResult<IWalletData> {}
