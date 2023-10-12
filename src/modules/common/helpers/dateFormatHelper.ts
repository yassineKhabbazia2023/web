export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const dayString = day < 10 ? '0' + day : '' + day
  const monthString = month < 10 ? '0' + month : '' + month

  return `${dayString}/${monthString}/${year}`
}
