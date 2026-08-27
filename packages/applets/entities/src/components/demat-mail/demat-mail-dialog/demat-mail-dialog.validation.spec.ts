import type { FormItemRule } from 'element-plus'
import { createDematMailRules } from './demat-mail-dialog.validation'

const TRANSLATIONS = {
  emailRequired: 'Veuillez saisir une adresse e-mail',
  emailInvalid: 'Veuillez saisir une adresse e-mail valide',
}

function runRules(value: string): string[] {
  const rules = createDematMailRules(TRANSLATIONS).email as FormItemRule[]
  const errors: string[] = []

  rules.forEach((rule) => {
    rule.validator?.(rule, value, (error?: string | Error) => {
      if (error !== undefined) {
        errors.push(error instanceof Error ? error.message : error)
      }
    }, {}, {})
  })

  return errors
}

describe('createDematMailRules', () => {
  it('should reject an empty email as required', () => {
    expect(runRules('')).toContain(TRANSLATIONS.emailRequired)
  })

  it('should reject a blank email as required', () => {
    expect(runRules('   ')).toContain(TRANSLATIONS.emailRequired)
  })

  it('should reject a malformed email', () => {
    expect(runRules('not-an-email')).toContain(TRANSLATIONS.emailInvalid)
  })

  it('should accept a valid email', () => {
    expect(runRules('facture@example.com')).toStrictEqual([])
  })
})
