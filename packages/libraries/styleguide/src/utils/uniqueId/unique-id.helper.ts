export function generateUniqueId(): string {
  const timePart = Date.now().toString(36)
  const randomArray = new Uint32Array(1)
  crypto.getRandomValues(randomArray)
  const randomPart = randomArray[0].toString(36).substring(0, 7)
  return `${timePart}-${randomPart}`
}
