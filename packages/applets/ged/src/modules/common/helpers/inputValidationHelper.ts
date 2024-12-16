
export const validInputAlphanumericFrench = (input: string): boolean => {
  const regex = /^[^“"*:<>?|/\\]*$/
  return regex.test(input) && input?.trim().length !== 0
}

export const INPUT_MAX_LENGTH = 255

export const validInputMaxLength = (input: string): boolean =>
  input?.trim().length < INPUT_MAX_LENGTH + 1
