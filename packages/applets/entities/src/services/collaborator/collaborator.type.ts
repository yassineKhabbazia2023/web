export interface GenericPageResponse<T> {
  items: T[]
  currentPage: number
  totalItems: number
  totalPages?: number
  totalPage?: number // due to getCollaboratorsByIdEntity :/
}
