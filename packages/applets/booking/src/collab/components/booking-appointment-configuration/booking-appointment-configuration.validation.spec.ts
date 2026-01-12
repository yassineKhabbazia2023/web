import { computed } from 'vue'
import type { FormItemRule } from 'element-plus'
import type { AppointmentDetails } from './booking-appointment-configuration.types'
import { useBookingAppointmentValidation } from './booking-appointment-configuration.validation'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

const createFormData = (overrides: Partial<AppointmentDetails> = {}) => {
  return computed(() => ({
    name: '',
    description: '',
    location: '',
    isOnline: false,
    duration: 0,
    ...overrides,
  }))
}

const getFirstRule = (rules: FormItemRule | FormItemRule[] | undefined): FormItemRule | undefined => {
  if (Array.isArray(rules)) {
    return rules[0]
  }
  return rules
}

describe('booking-appointment-configuration.validation', () => {
  describe('rules', () => {
    describe('name validation', () => {
      it('should have name validation rule defined', () => {
        const formData = createFormData()
        const { rules } = useBookingAppointmentValidation(formData)

        expect(rules.value.name).toBeDefined()
      })

      it('should pass validation for non-empty name', () => {
        return new Promise<void>((resolve) => {
          const formData = createFormData({ name: 'Meeting' })
          const { rules } = useBookingAppointmentValidation(formData)
          const nameRule = getFirstRule(rules.value.name)

          if (nameRule?.validator) {
            nameRule.validator({}, 'Meeting', (error: Error | string | undefined) => {
              expect(error).toBeUndefined()
              resolve()
            }, {}, {})
          }
        })
      })

      it('should fail validation for empty name', () => {
        return new Promise<void>((resolve) => {
          const formData = createFormData()
          const { rules } = useBookingAppointmentValidation(formData)
          const nameRule = getFirstRule(rules.value.name)

          if (nameRule?.validator) {
            nameRule.validator({}, '', (error: Error | string | undefined) => {
              expect(error).toBeInstanceOf(Error)
              if (error instanceof Error) {
                expect(error.message).toBe('booking-appointment-configuration.name.error')
              }
              resolve()
            }, {}, {})
          }
        })
      })
    })

    describe('location validation', () => {
      it('should have location validation rule defined', () => {
        const formData = createFormData()
        const { rules } = useBookingAppointmentValidation(formData)

        expect(rules.value.location).toBeDefined()
      })

      it('should pass validation for non-empty location when isOnline is false', () => {
        return new Promise<void>((resolve) => {
          const formData = createFormData({ isOnline: false, location: 'Office' })
          const { rules } = useBookingAppointmentValidation(formData)
          const locationRule = getFirstRule(rules.value.location)

          if (locationRule?.validator) {
            locationRule.validator({}, 'Office', (error: Error | string | undefined) => {
              expect(error).toBeUndefined()
              resolve()
            }, {}, {})
          }
        })
      })

      it('should fail validation for empty location when isOnline is false', () => {
        return new Promise<void>((resolve) => {
          const formData = createFormData({ isOnline: false })
          const { rules } = useBookingAppointmentValidation(formData)
          const locationRule = getFirstRule(rules.value.location)

          if (locationRule?.validator) {
            locationRule.validator({}, '', (error: Error | string | undefined) => {
              expect(error).toBeInstanceOf(Error)
              if (error instanceof Error) {
                expect(error.message).toBe('booking-appointment-configuration.location.error')
              }
              resolve()
            }, {}, {})
          }
        })
      })

      it('should pass validation for empty location when isOnline is true', () => {
        return new Promise<void>((resolve) => {
          const formData = createFormData({ isOnline: true })
          const { rules } = useBookingAppointmentValidation(formData)
          const locationRule = getFirstRule(rules.value.location)

          if (locationRule?.validator) {
            locationRule.validator({}, '', (error: Error | string | undefined) => {
              expect(error).toBeUndefined()
              resolve()
            }, {}, {})
          }
        })
      })
    })

    describe('duration validation', () => {
      it('should have duration validation rule defined', () => {
        const formData = createFormData()
        const { rules } = useBookingAppointmentValidation(formData)

        expect(rules.value.duration).toBeDefined()
      })

      it('should pass validation for valid duration', () => {
        return new Promise<void>((resolve) => {
          const formData = createFormData({ duration: 30 })
          const { rules } = useBookingAppointmentValidation(formData)
          const durationRule = getFirstRule(rules.value.duration)

          if (durationRule?.validator) {
            durationRule.validator({}, 30, (error: Error | string | undefined) => {
              expect(error).toBeUndefined()
              resolve()
            }, {}, {})
          }
        })
      })

      it('should fail validation for null duration', () => {
        return new Promise<void>((resolve) => {
          const formData = createFormData()
          const { rules } = useBookingAppointmentValidation(formData)
          const durationRule = getFirstRule(rules.value.duration)

          if (durationRule?.validator) {
            durationRule.validator({}, null, (error: Error | string | undefined) => {
              expect(error).toBeInstanceOf(Error)
              resolve()
            }, {}, {})
          }
        })
      })
    })
  })

  describe('durationOptions', () => {
    it('should return 16 duration options', () => {
      const formData = createFormData()
      const { durationOptions } = useBookingAppointmentValidation(formData)

      expect(durationOptions.value).toHaveLength(16)
    })

    it('should have correct first option (15 minutes)', () => {
      const formData = createFormData()
      const { durationOptions } = useBookingAppointmentValidation(formData)

      expect(durationOptions.value[0]).toEqual({
        pValue: 15,
        pLabel: 'booking-appointment-configuration.duration.15min',
      })
    })

    it('should have correct last option (4 hours)', () => {
      const formData = createFormData()
      const { durationOptions } = useBookingAppointmentValidation(formData)

      expect(durationOptions.value[15]).toEqual({
        pValue: 240,
        pLabel: 'booking-appointment-configuration.duration.4hours',
      })
    })

    it('should have 30 minutes option', () => {
      const formData = createFormData()
      const { durationOptions } = useBookingAppointmentValidation(formData)

      const thirtyMinOption = durationOptions.value.find(opt => opt.pValue === 30)
      expect(thirtyMinOption).toEqual({
        pValue: 30,
        pLabel: 'booking-appointment-configuration.duration.30min',
      })
    })

    it('should have 1 hour option', () => {
      const formData = createFormData()
      const { durationOptions } = useBookingAppointmentValidation(formData)

      const oneHourOption = durationOptions.value.find(opt => opt.pValue === 60)
      expect(oneHourOption).toEqual({
        pValue: 60,
        pLabel: 'booking-appointment-configuration.duration.1hour',
      })
    })

    it('should have all duration values in 15 minute increments', () => {
      const formData = createFormData()
      const { durationOptions } = useBookingAppointmentValidation(formData)

      const expectedValues = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240]
      const actualValues = durationOptions.value.map(opt => opt.pValue)

      expect(actualValues).toEqual(expectedValues)
    })
  })
})
