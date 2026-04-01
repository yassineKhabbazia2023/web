import { ref, nextTick } from 'vue'
import type { Ref } from 'vue'
import { withSetup } from '@pulse/toolbox/utils/test'
import { usePhoneInput } from './p-phone-input.composable'
import type { UsePhoneInputOptions } from './p-phone-input.types'
import type { CountryCode } from 'libphonenumber-js'

function createComposable(
  modelValue = '',
  defaultCountry: CountryCode = 'FR',
  preferredCountries: CountryCode[] = [],
  countryDisabled = false,
) {
  const model = ref(modelValue)
  const options: UsePhoneInputOptions = {
    pDefaultCountry: defaultCountry,
    pCountryDisabled: countryDisabled,
    pPreferredCountries: preferredCountries,
  }
  const [result] = withSetup(() => usePhoneInput(model, options))
  return { model, ...result }
}

describe('usePhoneInput', () => {
  describe('initialization', () => {
    it('should default to the specified country with empty national number', () => {
      const { selectedCountry, nationalNumber } = createComposable('', 'BE')

      expect(selectedCountry.value).toBe('BE')
      expect(nationalNumber.value).toBe('')
    })

    it('should parse an E.164 French number on init', () => {
      const { selectedCountry, nationalNumber } = createComposable('+33612345678')

      expect(selectedCountry.value).toBe('FR')
      expect(nationalNumber.value).toBe('06 12 34 56 78')
    })

    it('should parse an E.164 US number on init', () => {
      const { selectedCountry, nationalNumber } = createComposable('+12133734253')

      expect(selectedCountry.value).toBe('US')
      expect(nationalNumber.value).toBe('(213) 373-4253')
    })

    it('should keep empty state when modelValue is empty', () => {
      const { selectedCountry, nationalNumber } = createComposable('')

      expect(selectedCountry.value).toBe('FR')
      expect(nationalNumber.value).toBe('')
    })
  })

  describe('model emission', () => {
    it('should update model with E.164 when national number changes', async () => {
      const { model, nationalNumber } = createComposable('', 'FR')

      nationalNumber.value = '0612345678'
      await nextTick()

      expect(model.value).toBe('+33612345678')
    })

    it('should emit empty string when national number is cleared', async () => {
      const { model, nationalNumber } = createComposable('+33612345678')
      await nextTick()

      nationalNumber.value = ''
      await nextTick()

      expect(model.value).toBe('')
    })

    it('should not re-parse model when the change originated from the composable', async () => {
      const { model, nationalNumber, selectedCountry } = createComposable('', 'FR')

      nationalNumber.value = '0612345678'
      await nextTick()

      expect(model.value).toBe('+33612345678')
      expect(selectedCountry.value).toBe('FR')
      expect(nationalNumber.value).toBe('0612345678')
    })
  })

  describe('external model changes', () => {
    it('should parse a new E.164 value set externally', async () => {
      const { model, selectedCountry, nationalNumber } = createComposable('')

      model.value = '+442071234567'
      await nextTick()

      expect(selectedCountry.value).toBe('GB')
      expect(nationalNumber.value).toBe('020 7123 4567')
    })

    it('should clear national number when model is set to empty', async () => {
      const { model, nationalNumber } = createComposable('+33612345678')
      await nextTick()

      model.value = ''
      await nextTick()

      expect(nationalNumber.value).toBe('')
    })
  })

  describe('country change', () => {
    it('should re-emit E.164 after country change', async () => {
      const { model, nationalNumber, onCountryChange } = createComposable('', 'FR')

      nationalNumber.value = '0612345678'
      await nextTick()

      onCountryChange()
      expect(model.value).toContain('+')
    })

    it('should reset filter query on country change', () => {
      const { filteredCountries, countryOptions, onFilterCountries, onCountryChange } = createComposable()

      onFilterCountries('xyz')
      expect(filteredCountries.value.length).toBeLessThan(countryOptions.value.length)

      onCountryChange()
      expect(filteredCountries.value.length).toBe(countryOptions.value.length)
    })
  })

  describe('filtering', () => {
    it('should filter countries by name', () => {
      const { filteredCountries, onFilterCountries } = createComposable()

      onFilterCountries('France')

      expect(filteredCountries.value.length).toBeGreaterThan(0)
      expect(filteredCountries.value.some((c) => c.code === 'FR')).toBe(true)
    })

    it('should show all countries when filter is cleared', () => {
      const { filteredCountries, countryOptions, onFilterCountries } = createComposable()

      onFilterCountries('France')
      onFilterCountries('')

      expect(filteredCountries.value.length).toBe(countryOptions.value.length)
    })
  })

  describe('buildE164 fallback', () => {
    it('should use dial code prefix when number is too short to parse', async () => {
      const { model, nationalNumber } = createComposable('', 'FR')

      nationalNumber.value = '1'
      await nextTick()

      expect(model.value).toBe('+331')
    })

    it('should use the selected country dial code for the fallback', async () => {
      const { model, nationalNumber } = createComposable('', 'BE')

      nationalNumber.value = '1'
      await nextTick()

      expect(model.value).toBe('+321')
    })
  })

  describe('parseModelValue edge cases', () => {
    it('should clear national number when model is set to null', async () => {
      const { model, nationalNumber } = createComposable('+33612345678')
      await nextTick()

      ;(model as Ref<string | null>).value = null as unknown as string
      await nextTick()

      expect(nationalNumber.value).toBe('')
    })

    it('should clear national number when model is set to undefined', async () => {
      const { model, nationalNumber } = createComposable('+33612345678')
      await nextTick()

      ;(model as Ref<string | undefined>).value = undefined as unknown as string
      await nextTick()

      expect(nationalNumber.value).toBe('')
    })
  })

  describe('preferred countries', () => {
    it('should place preferred countries first in options', () => {
      const { countryOptions } = createComposable('', 'FR', ['BE', 'CH'])

      expect(countryOptions.value[0].code).toBe('BE')
      expect(countryOptions.value[1].code).toBe('CH')
    })
  })

  describe('displayNumber', () => {
    it('should format input through AsYouType when set', () => {
      const { displayNumber, nationalNumber } = createComposable('', 'FR')

      displayNumber.value = '0612345678'

      expect(nationalNumber.value).toBe('06 12 34 56 78')
    })

    it('should return nationalNumber value on get', () => {
      const { displayNumber, nationalNumber } = createComposable('+33612345678')

      expect(displayNumber.value).toBe(nationalNumber.value)
    })

    it('should auto-detect country when typing an international number', () => {
      const { displayNumber, selectedCountry, nationalNumber } = createComposable('', 'FR')

      displayNumber.value = '+34609101112'

      expect(selectedCountry.value).toBe('ES')
      expect(nationalNumber.value).toBe('609 10 11 12')
    })

    it('should auto-detect country for a US number', () => {
      const { displayNumber, selectedCountry, nationalNumber } = createComposable('', 'FR')

      displayNumber.value = '+12133734253'

      expect(selectedCountry.value).toBe('US')
      expect(nationalNumber.value).toBe('(213) 373-4253')
    })

    it('should not change country when country is disabled', () => {
      const { displayNumber, selectedCountry } = createComposable('', 'FR', [], true)

      displayNumber.value = '+34609101112'

      expect(selectedCountry.value).toBe('FR')
    })

    it('should update model after auto-detection', async () => {
      const { model, displayNumber } = createComposable('', 'FR')

      displayNumber.value = '+34609101112'
      await nextTick()

      expect(model.value).toBe('+34609101112')
    })

    it('should update model when pasting an international number with spaces', async () => {
      const { model, displayNumber, selectedCountry, nationalNumber } = createComposable('', 'FR')

      displayNumber.value = '+34 0609464753'
      await nextTick()

      expect(selectedCountry.value).toBe('ES')
      expect(nationalNumber.value).not.toBe('')
      expect(model.value).toContain('+34')
    })
  })
})
