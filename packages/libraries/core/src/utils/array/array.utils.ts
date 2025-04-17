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

export function arrayIncludes<T>(array: T[], value: T | T[]) {
  return Array.isArray(value)
    ? value.some((v) => array.includes(v))
    : array.includes(value)
}
