/* eslint-disable no-unused-vars */
export const validInputAlphanumericFrench = (input: string): boolean => {
  const regex = /^[^“"*:<>?|/\\]*$/
  return regex.test(input) && input?.trim().length !== 0
}

export const validInputMaxLength = (input: string): boolean =>
  input?.trim().length < 256
