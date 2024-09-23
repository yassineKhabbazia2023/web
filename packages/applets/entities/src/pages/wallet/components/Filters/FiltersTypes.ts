import type { Component } from 'vue'
/* eslint-disable no-unused-vars */
export enum EntityStatus {
  TO_DEPLOY = 1,
  IN_PROGRESS = 2,
  CONNECTED = 3,
}
/* eslint-enable no-unused-vars */

export interface Filter {
  number: number
  content: string
  icon: Component
  color: string
  apiKey: string
  filterValue: EntityStatus
  isSelected : boolean
}

export interface State {
  userTags: Filter[]
  entityTags: Filter[]
  isLoading: boolean | undefined
}
