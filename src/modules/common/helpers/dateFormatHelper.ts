export const formatDateStr = (inputDate: string): string => {
  const date = new Date(inputDate)

  return formatDate(date, '/')
}
export function formatDate(date: Date, separator: string): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const dayString = day < 10 ? '0' + day : '' + day
  const monthString = month < 10 ? '0' + month : '' + month
  return `${dayString}${separator}${monthString}${separator}${year}`
}
