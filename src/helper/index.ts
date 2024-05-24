const COLORS = [
  'persian',
  'orange',
  'cyan',
  'amethyste',
  'teal',
  'green',
  'fuschia',
  'gray',
]

/**
 * This helper is created temporarily to generate a random color and will be deleted once the backend is ready
 * @returns string
 */
export const getRandomColor = (index: number) => COLORS[index % COLORS.length]

/**
 * This helper is created to get the current user's browser name
 * @returns string
 */
export const getBrowserName = (): string => {
  if (navigator.userAgent.indexOf('OPR') !== -1) {
    return 'Opera'
  } else if (navigator.userAgent.indexOf('Edg') !== -1) {
    return 'Microsoft Edge'
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'Chrome'
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    return 'Safari'
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'Firefox'
  } else if (navigator.userAgent.indexOf('MSIE') !== -1) {
    return 'Microsoft Internet Explorer'
  } else {
    return 'Unknown'
  }
}

/**
 * Return duplicate rows in list
 * @example list([1, 2, 1]) returns [1]
 * @param list: T[]
 * @returns T[]
 */
export function getDuplicates<T>(list: T[]) {
  return list
    .reduce<T[]>((duplicates, value, index) => {
      const isDuplicate = !duplicates.includes(value) && list.includes(value, index + 1)

      if (isDuplicate) {
        duplicates.push(value)
      }
      return duplicates
    }, [] as T[])
}
