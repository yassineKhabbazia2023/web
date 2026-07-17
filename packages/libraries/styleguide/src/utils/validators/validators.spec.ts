import { validationRules } from './validators'

describe('validators', () => {
  describe('requiredTextInput', () => {
    it('should pass validation for non-empty text', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredTextInput('Error message')
        if (rule.validator) {
          rule.validator({}, 'Valid text', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for empty string', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredTextInput('Error message')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Error message')
            }
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for whitespace-only string', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredTextInput('Error message')
        if (rule.validator) {
          rule.validator({}, '   ', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Error message')
            }
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for null', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredTextInput('Error message')
        if (rule.validator) {
          rule.validator({}, null, (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for undefined', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredTextInput('Error message')
        if (rule.validator) {
          rule.validator({}, undefined, (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })
  })

  describe('requiredSelect', () => {
    it('should pass validation for valid value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredSelect('Error message')
        if (rule.validator) {
          rule.validator({}, 'value', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should pass validation for number value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredSelect('Error message')
        if (rule.validator) {
          rule.validator({}, 42, (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for null', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredSelect('Error message')
        if (rule.validator) {
          rule.validator({}, null, (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for undefined', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredSelect('Error message')
        if (rule.validator) {
          rule.validator({}, undefined, (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for empty string', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredSelect('Error message')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })
  })

  describe('requiredMultiSelect', () => {
    it('should pass validation for a non-empty array', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredMultiSelect('Error message')
        if (rule.validator) {
          rule.validator({}, ['a', 'b'], (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for an empty array', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredMultiSelect('Error message')
        if (rule.validator) {
          rule.validator({}, [], (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Error message')
            }
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for null', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredMultiSelect('Error message')
        if (rule.validator) {
          rule.validator({}, null, (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for undefined', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredMultiSelect('Error message')
        if (rule.validator) {
          rule.validator({}, undefined, (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for a non-array value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.requiredMultiSelect('Error message')
        if (rule.validator) {
          rule.validator({}, 'string', (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })
  })

  describe('email', () => {
    const tooLongTldBase = 'toolongtldddddddddddddddddddddddddddddddddd'
    const tooLongTld = `test@domain.${tooLongTldBase}${'d'.repeat(Math.max(0, 64 - tooLongTldBase.length))}`
    const tests = [
      { value: 'test@example.com', expectedError: false, reason: 'valid email' },
      { value: '  test@example.com  ', expectedError: false, reason: 'valid email with spaces' },
      { value: '', expectedError: false, reason: 'empty value' },
      { value: 'invalid-email', expectedError: true, reason: 'invalid email' },
      { value: 'tést@example.com', expectedError: true, reason: 'non-ascii local part' },
      { value: '.test@gmail.com', expectedError: true, reason: 'dot at start' },
      { value: 'test@.com.fs', expectedError: true, reason: 'dot after at' },
      { value: 'test.@gmail.com', expectedError: true, reason: 'dot at end of local part' },
      { value: 'test..email@gmail.com', expectedError: true, reason: 'double dot local part' },
      { value: 'test@gmail..com', expectedError: true, reason: 'double dot domain' },
      { value: 'test@domain.c', expectedError: true, reason: 'short tld' },
      { value: 'test@domain.123', expectedError: true, reason: 'numeric tld' },
      { value: tooLongTld, expectedError: true, reason: 'too long tld' },
      { value: '用户@domain.com', expectedError: true, reason: 'unicode local part' },
      { value: 'test@dömain.com', expectedError: true, reason: 'unicode domain part' },
      { value: 'test@gmail.com<script>', expectedError: true, reason: 'script injection' },
      { value: 'test@gmail.com;', expectedError: true, reason: 'trailing semicolon' },
      { value: 'test@gmail.com--', expectedError: true, reason: 'trailing hyphens' },
    ]

    it.each(tests)('should handle $reason', ({ value, expectedError }) => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.email('Invalid email')
        if (rule.validator) {
          rule.validator({}, value, (error) => {
            if (expectedError) {
              expect(error).toBeInstanceOf(Error)
              if (error instanceof Error) {
                expect(error.message).toBe('Invalid email')
              }
            } else {
              expect(error).toBeUndefined()
            }
            resolve()
          }, {}, {})
        }
      })
    })
  })

  describe('conditionalRequired', () => {
    it('should pass validation when condition is false', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.conditionalRequired(() => false, 'Error message')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should pass validation when condition is true and value is valid', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.conditionalRequired(() => true, 'Error message')
        if (rule.validator) {
          rule.validator({}, 'Valid value', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation when condition is true and value is empty', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.conditionalRequired(() => true, 'Error message')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Error message')
            }
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation when condition is true and value is null', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.conditionalRequired(() => true, 'Error message')
        if (rule.validator) {
          rule.validator({}, null, (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })
  })

  describe('minLength', () => {
    it('should pass validation for value exceeding min length', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.minLength(5, 'Too short')
        if (rule.validator) {
          rule.validator({}, 'Valid text', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should pass validation for empty value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.minLength(5, 'Too short')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for value below min length', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.minLength(5, 'Too short')
        if (rule.validator) {
          rule.validator({}, 'abc', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Too short')
            }
            resolve()
          }, {}, {})
        }
      })
    })
  })

  describe('maxLength', () => {
    it('should pass validation for value below max length', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.maxLength(10, 'Too long')
        if (rule.validator) {
          rule.validator({}, 'Short', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should pass validation for empty value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.maxLength(10, 'Too long')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for value exceeding max length', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.maxLength(5, 'Too long')
        if (rule.validator) {
          rule.validator({}, 'This is too long', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Too long')
            }
            resolve()
          }, {}, {})
        }
      })
    })
  })

  describe('phoneNumber', () => {
    it('should pass validation for a valid E.164 phone number', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.phoneNumber('Invalid phone')
        if (rule.validator) {
          rule.validator({}, '+33612345678', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should pass validation for empty value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.phoneNumber('Invalid phone')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should pass validation for null value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.phoneNumber('Invalid phone')
        if (rule.validator) {
          rule.validator({}, null, (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for an incomplete phone number', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.phoneNumber('Invalid phone')
        if (rule.validator) {
          rule.validator({}, '+3361', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Invalid phone')
            }
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for random text', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.phoneNumber('Invalid phone')
        if (rule.validator) {
          rule.validator({}, 'not-a-phone', (error) => {
            expect(error).toBeInstanceOf(Error)
            resolve()
          }, {}, {})
        }
      })
    })

    it('should use blur trigger', () => {
      const rule = validationRules.phoneNumber('Invalid phone')

      expect(rule.trigger).toBe('blur')
    })
  })

  describe('custom', () => {
    it('should pass validation when custom validator returns true', () => {
      return new Promise<void>((resolve) => {
        const customValidator = (value: string) => value.startsWith('test')
        const rule = validationRules.custom(customValidator, 'Must start with test')
        if (rule.validator) {
          rule.validator({}, 'test-value', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation when custom validator returns false', () => {
      return new Promise<void>((resolve) => {
        const customValidator = (value: string) => value.startsWith('test')
        const rule = validationRules.custom(customValidator, 'Must start with test')
        if (rule.validator) {
          rule.validator({}, 'invalid-value', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Must start with test')
            }
            resolve()
          }, {}, {})
        }
      })
    })

    it('should use correct trigger', () => {
      const customValidator = (value: string) => value === 'valid'
      const blurRule = validationRules.custom(customValidator, 'Error', 'blur')
      const changeRule = validationRules.custom(customValidator, 'Error', 'change')

      expect(blurRule.trigger).toBe('blur')
      expect(changeRule.trigger).toBe('change')
    })
  })
})
