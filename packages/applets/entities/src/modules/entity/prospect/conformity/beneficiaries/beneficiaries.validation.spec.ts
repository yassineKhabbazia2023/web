import type { FormItemRule } from 'element-plus'
import { buildBeneficiaryFormRules } from './beneficiaries.validation'

const REQUIRED_ERROR_MESSAGE = 'Champ obligatoire'

// element-plus validators are callback-based and synchronous: run one and
// return the error it reports, if any
const runValidator = (rule: FormItemRule, value: unknown): Error | undefined => {
  let reportedError: Error | undefined
  const validator = rule.validator as (
    rule: FormItemRule,
    value: unknown,
    callback: (error?: Error) => void,
  ) => void
  validator(rule, value, (error?: Error) => {
    reportedError = error
  })
  return reportedError
}

describe('buildBeneficiaryFormRules', () => {
  const rules = buildBeneficiaryFormRules(REQUIRED_ERROR_MESSAGE)

  it.each(['documentType', 'lastName', 'firstName'] as const)(
    'should declare %s as a required field',
    (field) => {
      expect(rules[field]).toHaveLength(1)
      expect(rules[field][0].required).toBe(true)
    },
  )

  describe('documentType', () => {
    it('should report an error when no document type is selected', () => {
      const error = runValidator(rules.documentType[0], null)
      expect(error?.message).toBe(REQUIRED_ERROR_MESSAGE)
    })

    it('should pass when a document type is selected', () => {
      const error = runValidator(rules.documentType[0], 'CNI')
      expect(error).toBeUndefined()
    })
  })

  describe.each(['lastName', 'firstName'] as const)('%s', (field) => {
    it('should report an error when empty', () => {
      const error = runValidator(rules[field][0], '')
      expect(error?.message).toBe(REQUIRED_ERROR_MESSAGE)
    })

    it('should report an error when only whitespace', () => {
      const error = runValidator(rules[field][0], '   ')
      expect(error?.message).toBe(REQUIRED_ERROR_MESSAGE)
    })

    it('should pass when filled', () => {
      const error = runValidator(rules[field][0], 'Dupont')
      expect(error).toBeUndefined()
    })
  })
})
