import {
  validInputAlphanumericFrench,
  validInputMaxLength,
  validInputAlphanumericFrenchWithSpecialCharacters
} from './inputValidationHelper'
import { describe, it, expect } from 'vitest'

describe('inputValidationHelper', () => {
  it('should return true if input is in french', () => {
    const res = validInputAlphanumericFrench('ceci est un test')

    expect(res).toBeTruthy()
  })
  it('should return false if input is not Alphanumeric French', () => {
    const res = validInputAlphanumericFrench('ceci est un fail µµµµµµ')

    expect(res).toBeFalsy()
  })

  it('should return false if input has special character', () => {
    const res = validInputAlphanumericFrenchWithSpecialCharacters('oh lala ça fail$')

    expect(res).toBeFalsy()
  })
  it('should return true if input doesn not have special character', () => {
    const res = validInputAlphanumericFrenchWithSpecialCharacters('oh lala ça fonctionne')

    expect(res).toBeTruthy()
  })
  it('should return false if input is empty', () => {
    const res = validInputAlphanumericFrench(' ')

    expect(res).toBeFalsy()
  })
  it('should return true if input lenght < 256 char', () => {
    const res = validInputMaxLength('azerty')

    expect(res).toBeTruthy()
  })
  it('should return false if input lenght > 256 char', () => {
    let input = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    input += 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

    const res = validInputMaxLength(input)

    expect(res).toBeFalsy()
  })
})
