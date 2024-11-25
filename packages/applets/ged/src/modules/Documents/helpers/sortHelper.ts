export const returnSortQueryField = (columnLabel: string, order: string) => {
  const sortPrefix = order === 'ascending' ? '+' : '-'
  let sortValue = 'created'

  if (columnLabel === 'Nom du document' && order !== null) {
    sortValue = 'name'
  }

  if (columnLabel === 'Déposé le' && order !== null) {
    sortValue = 'created'
  }

  if (columnLabel === 'Supprimé le' && order !== null) {
    sortValue = 'deleted'
  }

  return `${sortPrefix}${sortValue}`
}
