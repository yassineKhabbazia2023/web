export function capitalizeFirstLetter(str) {
  if (str.includes('-')) {
    const words = str.split('-')
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
  }

  return str.charAt(0).toUpperCase() + str.slice(1)
}
