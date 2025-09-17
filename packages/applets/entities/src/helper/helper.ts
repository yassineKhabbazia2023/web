import { logger } from '@pulse/core'
import type { PaginationData } from './helperTypes'

export const handleRequestError = (action: string, error: any) => {
  logger.error(`Error ${action}:`, error)
}
export const getInitials = (firstName: string|undefined, lastName: string|undefined) => {
  const firstInitial = firstName?.at(0)?.toUpperCase() ?? ''
  const secondInitial = lastName?.at(0)?.toUpperCase() ?? ''
  return `${firstInitial}${secondInitial}`
}

/**
 * Simple function that extracts values from an object using dot-separate
 * keys and constructs a new object with these keys and values.
 *
 * Example : {'a.b': 22} ===> {a: {b: 22}}
 */
export const generateObject = (
  parentKey: string,
  mainObject: Record<string, string | number>,
) => {
  const generatedObject: any = { [parentKey]: {} }

  // To retrieve only the entries with keys that contain the parent key
  const filteredEntries = Object.fromEntries(
    Object.entries(mainObject).filter(([key]) => key.includes(`${parentKey}.`)),
  )
  // To construct our new object
  for (const [key, value] of Object.entries(filteredEntries)) {
    const childKey = key.split('.')[1]
    generatedObject[parentKey][childKey] = value
  }

  return generatedObject
}

export const formatDateToLocale = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

export function getPaginationLabel<T>(onLabel: string, {
  currentPage,
  limit,
  data,
  totalItems,
}: PaginationData<T>) {
  if (currentPage === undefined || limit === undefined || totalItems === undefined) {
    return ''
  }
  const displayCount = data.length
  const pageIndex = currentPage === 0 ? 0 : currentPage - 1
  const firstRowNumber = 1 + pageIndex * limit
  const lastRowNumber = pageIndex * limit + displayCount

  return `${firstRowNumber} - ${lastRowNumber} ${onLabel} ${totalItems}`
}

const SORT_VALUES = new Map<string, string>([
  ['createdAt', 'created'],
  ['role', 'persona'],
  ['email', 'email'],
  ['persona', 'persona'],
  ['office', 'office'],
])
export const returnSortQueryField = (columnProp: string, descending: boolean) => {
  const sortPrefix = descending === true ? '-' : '+'
  const sortValue = SORT_VALUES.get(columnProp) ?? 'lastname'

  return `${sortPrefix}${sortValue}`
}
