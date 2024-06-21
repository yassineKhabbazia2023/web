export type SearchMandateParams = {
  currentPage: number
  limit: number
  searchTerm: string
  creationDateStart: string
  creationDateEnd: string
  modificationDateStart: string
  modificationDateEnd: string
  statusCodes: number[]
  sortCriteria: string
  sortOrder: 'Descending' | 'Ascending'
}
