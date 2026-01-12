import type { FormItemRule } from 'element-plus'

/**
 * Generic validation rules for Element Plus forms
 */
export const validationRules = {
  /**
   * Required text input validation
   * Checks if value is not empty after trimming
   */
  requiredTextInput: (errorMessage: string): FormItemRule => ({
    required: true,
    validator: (_rule, value, callback) => {
      if (value === null || value === undefined || value.trim() === '') {
        callback(new Error(errorMessage))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  }),

  /**
   * Required select/dropdown validation
   * Checks if value is not null/undefined/empty
   */
  requiredSelect: (errorMessage: string): FormItemRule => ({
    required: true,
    validator: (_rule, value, callback) => {
      if (value === null || value === undefined || value === '') {
        callback(new Error(errorMessage))
      } else {
        callback()
      }
    },
    trigger: 'change',
  }),

  /**
   * Email validation
   */
  email: (errorMessage: string): FormItemRule => ({
    validator: (_rule, value, callback) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        callback(new Error(errorMessage))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  }),

  /**
   * Conditional required validation
   * Only requires value if condition is true
   */
  conditionalRequired: (
    condition: () => boolean,
    errorMessage: string,
  ): FormItemRule => ({
    required: true,
    validator: (_rule, value, callback) => {
      if (condition() === true && (value === null || value === undefined || value.trim() === '')) {
        callback(new Error(errorMessage))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  }),

  /**
   * Min length validation for text
   */
  minLength: (min: number, errorMessage: string): FormItemRule => ({
    validator: (_rule, value, callback) => {
      if (value && value.length < min) {
        callback(new Error(errorMessage))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  }),

  /**
   * Max length validation for text
   */
  maxLength: (max: number, errorMessage: string): FormItemRule => ({
    validator: (_rule, value, callback) => {
      if (value && value.length > max) {
        callback(new Error(errorMessage))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  }),

  /**
   * Custom validator wrapper
   * Allows using manager functions
   */
  custom: (
    validator: (value: any) => boolean,
    errorMessage: string,
    trigger: 'blur' | 'change' = 'blur',
  ): FormItemRule => ({
    validator: (_rule, value, callback) => {
      if (validator(value) === false) {
        callback(new Error(errorMessage))
      } else {
        callback()
      }
    },
    trigger,
  }),
}
