export function getRandomString(length: number) {
  const list: string[] = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charactersLength)
    const row = characters.charAt(index)
    list.push(row)
  }
  return list.join('')
}
