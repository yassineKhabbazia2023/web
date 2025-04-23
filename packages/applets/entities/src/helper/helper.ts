import dayjs from 'dayjs'
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

export const removeFalsyValues = (obj: object) =>
  Object.entries(obj).reduce(
    (acc: any, [key, value]) => (value ? ((acc[key] = value), acc) : acc),
    {},
  )

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

export const returnSortQueryField = (columnProp: string, order: string | null) => {
  const sortPrefix = order === 'ascending' ? '+' : '-'
  let sortValue = 'lastname'

  if (columnProp === 'user' && order !== null) {
    sortValue = 'lastname'
  }

  if (columnProp === 'email' && order !== null) {
    sortValue = 'email'
  }

  if (columnProp === 'createdAt' && order !== null) {
    sortValue = 'created'
  }

  if (columnProp === 'persona' && order !== null) {
    sortValue = 'persona'
  }

  if (columnProp === 'role' && order !== null) {
    sortValue = 'persona'
  }

  return `${sortPrefix}${sortValue}`
}

/**
 * Compares two date strings and returns the more recent one.
 * - If both dates are valid, returns the most recent.
 * - If only one is valid, returns the valid one.
 * - If neither date is valid, returns undefined.
 */
export function getMostRecentDate(dateStr1?: string, dateStr2?: string): string | undefined {
  const isValidDate1 = dateStr1 && dayjs(dateStr1).isValid()
  const isValidDate2 = dateStr2 && dayjs(dateStr2).isValid()

  if (!isValidDate1 && !isValidDate2) {
    return
  }

  if (!isValidDate1) {
    return dateStr2
  }
  if (!isValidDate2) {
    return dateStr1
  }

  return dayjs(dateStr1).isAfter(dayjs(dateStr2)) ? dateStr1 : dateStr2
}
