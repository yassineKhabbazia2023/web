import type { QueryResult } from '@/types/commonTypes'
import type { PaginationData } from '@/helper/helperTypes'
import type { Component } from 'vue'

export interface DeploymentStatus {
  text: string
  icon: Component
  color: string
}

export interface WalletData {
  owner: {
    contactId: number
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
  accountId: number
  accountNumber: string
  name: string
  isFavorite: boolean
}
export interface State extends PaginationData<WalletData> {
  totalPage: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
  filterByDeploymentStatus: string | undefined
}

export interface SearchCriteria {
  currentPage: number
  limit: number
  search?: string
  accountNumber?: string
  filterByDeploymentStatus?: string
}

export interface SearchResult extends QueryResult<WalletData> {}
