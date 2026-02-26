export interface AccountRow {
  accountId: number
  name: string
  accountNumber: string
  isCustomerRelation?: boolean
}

export interface AccountFilters {
  isFavoriteFilter: boolean,
  isCustomerRelationFilter: boolean
}
