export const returnSortQueryField = (columnLabel: string, order: string) => {
  const sortPrefix = order === 'ascending' ? '+' : '-'
  let sortValue = 'created'

  if (columnLabel === 'Nom du document' && order !== null) sortValue = 'name'

  if (columnLabel === 'Déposé le' && order !== null) sortValue = 'created'

  return `${sortPrefix}${sortValue}`
}
