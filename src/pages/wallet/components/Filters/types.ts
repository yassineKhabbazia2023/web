import type { Component } from 'vue'
/* eslint-disable no-unused-vars */
export enum EntityStatus {
  TO_DEPLOY = 1,
  IN_PROGRESS = 2,
  CONNECTED = 3,
}
/* eslint-enable no-unused-vars */

export interface IFilterOption {
  number: number
  content: string
  icon: Component
  color: string
  apiKey: string
  filterValue: EntityStatus
  isSelected : boolean
}

export interface IState {
  userTags: IFilterOption[]
  entityTags: IFilterOption[]
  isLoading: boolean | undefined
}
