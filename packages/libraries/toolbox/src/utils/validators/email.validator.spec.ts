import { describe, it, expect } from 'vitest'
import { validateEmail } from './email.validator'

describe('validateEmail', () => {
  it('returns false for empty email', () => {
    expect(validateEmail('')).toBe(false)
  })

  it('returns false when missing or having multiple @', () => {
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('a@b@c')).toBe(false)
  })

  it('returns false when local part is too long', () => {
    const email = `${'a'.repeat(65)}@example.com`
    expect(validateEmail(email)).toBe(false)
  })

  it('returns false when domain is too long', () => {
    const email = `a@${'a'.repeat(256)}`
    expect(validateEmail(email)).toBe(false)
  })

  it('returns false when a domain part is too long', () => {
    const email = `a@${'a'.repeat(64)}.com`
    expect(validateEmail(email)).toBe(false)
  })

  it('returns false when regex does not match', () => {
    const email = 'a..b@example.com'
    expect(validateEmail(email)).toBe(false)
  })

  it('returns true for a valid email', () => {
    const email = 'a.b+1@test.co'
    expect(validateEmail(email)).toBe(true)
  })

  describe('invalid emails list', () => {
    const tooLongTldBase = 'toolongtldddddddddddddddddddddddddddddddddd'
    const tooLongTld = `test@domain.${tooLongTldBase}${'d'.repeat(Math.max(0, 64 - tooLongTldBase.length))}`
    const invalidEmails = [
      '.test@gmail.com',
      'test@.com.fs',
      'test.@gmail.com',
      'test..email@gmail.com',
      'test@gmail..com',
      'test@domain.c',
      'test@domain.123',
      tooLongTld,
      'tést@gmail.com',
      '用户@domain.com',
      'test@dömain.com',
      'test@gmail.com<script>',
      'test@gmail.com;',
      'test@gmail.com--',
    ]

    it.each(invalidEmails)('returns false for %s', (email) => {
      expect(validateEmail(email)).toBe(false)
    })
  })
})
