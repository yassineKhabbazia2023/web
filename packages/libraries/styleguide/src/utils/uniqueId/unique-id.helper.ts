export function generateUniqueId(): string {
  const timePart = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `${timePart}-${randomPart}`
}
