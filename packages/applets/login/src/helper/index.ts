export const userNameGenerator = (lengthName = 8) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < lengthName; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}