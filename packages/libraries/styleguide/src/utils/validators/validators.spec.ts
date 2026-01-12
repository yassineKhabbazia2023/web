import { describe, it, expect } from 'vitest'
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

  describe('email', () => {
    it('should pass validation for valid email', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.email('Invalid email')
        if (rule.validator) {
          rule.validator({}, 'test@example.com', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should pass validation for empty value', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.email('Invalid email')
        if (rule.validator) {
          rule.validator({}, '', (error) => {
            expect(error).toBeUndefined()
            resolve()
          }, {}, {})
        }
      })
    })

    it('should fail validation for invalid email', () => {
      return new Promise<void>((resolve) => {
        const rule = validationRules.email('Invalid email')
        if (rule.validator) {
          rule.validator({}, 'invalid-email', (error) => {
            expect(error).toBeInstanceOf(Error)
            if (error instanceof Error) {
              expect(error.message).toBe('Invalid email')
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
