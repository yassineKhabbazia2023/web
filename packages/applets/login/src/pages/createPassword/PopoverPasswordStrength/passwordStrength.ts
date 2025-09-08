export enum PASSWORD_STRENGTH {
  STRONG,
  AVERAGE,
  WEAK,
}


const regexArray = [
  /[A-Z]/,
  /[a-z]/,
  /\d/,
  /[^a-zA-Z0-9]/,
]

export const levelPasswordStrength = (password: string):PASSWORD_STRENGTH => {
  if (!!password && password.length < 8) {
    return PASSWORD_STRENGTH.WEAK
  }
  let conditionsGroup = 0
  regexArray.forEach((regex) => {
    conditionsGroup += regex.test(password) ? 1 : 0
  })
  switch (conditionsGroup) {
    case 4:
      return PASSWORD_STRENGTH.STRONG
    case 3:
      return PASSWORD_STRENGTH.AVERAGE
    default:
      return PASSWORD_STRENGTH.WEAK
  }
}
