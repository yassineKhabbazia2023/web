import type { Component } from 'vue'
import { EntityStatus } from '@entities/modules/wallet/enums'

export interface Filter {
  number: number
  content: string
  icon: Component
  color: string
  apiKey: string
  filterValue: EntityStatus
  isSelected: boolean
}

export interface State {
  userTags: Filter[]
  entityTags: Filter[]
  isLoading: boolean | undefined
}
