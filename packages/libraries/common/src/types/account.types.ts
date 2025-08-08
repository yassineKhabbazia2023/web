export interface SearchCriteria {
    currentPage: number
    limit: number
    search?: string
    sorting?: {
        field?: string
        descending: boolean
    }
    accountNumber?: string
    filterByDeploymentStatus?: string
    isFavoriteFilter?: boolean
    isCustomerRelationFilter?: boolean
}

export interface FilterQueryParams {
    pageNumber: number,
    pageSize: number,
    search?: string,
    'sorting.field': string | undefined,
    'sorting.descending': boolean | undefined,
    accountNumber?: string,
    deploymentStatus?: string,
    isFavoriteFilter?: boolean
    isCustomerRelationFilter?: boolean
}
