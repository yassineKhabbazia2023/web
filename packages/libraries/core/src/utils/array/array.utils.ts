export function addIfNotExists<T>(arr: T[], item: T): T[] {
  if (!arr.includes(item)) {
    arr.push(item)
  }
  return arr
}

export function removeIfExists<T>(arr: T[], item: T): T[] {
  const index = arr.indexOf(item)
  if (index !== -1) {
    arr.splice(index, 1)
  }
  return arr
}
