import type { PToolboxItemProps } from '@pulse/styleguide'

export interface QueryResult<T> {
  currentPage: number
  items: T[]
  totalItems: number
  totalPage: number
}

export interface AccessibleMenuItem extends PToolboxItemProps {
  display : boolean
}
