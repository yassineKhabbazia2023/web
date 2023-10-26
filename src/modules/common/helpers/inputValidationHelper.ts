/* eslint-disable no-unused-vars */
export const validInputAlphanumericFrench = (input: string): boolean =>
  input?.match(/^[a-zA-Z0-9À-ÿ' ]+$/) !== null && input?.trim().length !== 0

export const validInputAlphanumericFrenchWithSpecialCharacters = (input: string): boolean =>
  input?.match(/^[a-zA-Z0-9À-ÿ_' ]+$/) !== null && input?.trim().length !== 0

export const validInputMaxLength = (input: string): boolean =>
  input?.trim().length < 256
