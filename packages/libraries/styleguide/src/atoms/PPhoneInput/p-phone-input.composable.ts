import { ref, computed, watch } from 'vue'
import { parsePhoneNumberFromString, AsYouType, getCountryCallingCode } from 'libphonenumber-js'
import { buildCountryOptions, filterCountryOptions } from './p-phone-input.util'
import type { Ref } from 'vue'
import type { CountryCode } from 'libphonenumber-js'
import type { UsePhoneInputOptions } from './p-phone-input.types'

/**
 * Composable that manages the full phone input logic:
 * country selection, national number formatting, E.164 conversion, and model synchronization.
 *
 * @param model - Two-way binding ref holding the phone number in E.164 format
 * @param options - Configuration (default country, preferred countries)
 */
export function usePhoneInput(model: Ref<string>, options: UsePhoneInputOptions) {
  const selectedCountry = ref<CountryCode>(options.pDefaultCountry)
  const nationalNumber = ref('')
  const filterQuery = ref('')
  let lastEmittedValue = ''

  const countryOptions = computed(() => buildCountryOptions(options.pPreferredCountries))

  const filteredCountries = computed(() =>
    filterCountryOptions(countryOptions.value, filterQuery.value),
  )

  /** Computed get/set that formats the user input on-the-fly using AsYouType. */
  const displayNumber = computed({
    get: () => nationalNumber.value,
    set: (value: string) => {
      if (value.startsWith('+') && options.pCountryDisabled === false) {
        const formatter = new AsYouType()
        formatter.input(value)
        const detectedCountry = formatter.getCountry()

        if (detectedCountry !== undefined) {
          selectedCountry.value = detectedCountry

          let nationalNum = formatter.getNumber()?.nationalNumber ?? ''

          if (nationalNum === '') {
            const dialCode = getCountryCallingCode(detectedCountry)
            const rawDigits = value.replaceAll(/\D/g, '')
            nationalNum = rawDigits.startsWith(dialCode)
              ? rawDigits.slice(dialCode.length)
              : rawDigits
          }

          const nationalFormatter = new AsYouType(detectedCountry)
          nationalNumber.value = nationalFormatter.input(nationalNum)
          return
        }
      }

      const formatter = new AsYouType(selectedCountry.value)
      nationalNumber.value = formatter.input(value)
    },
  })

  /** Updates the country filter query when the user types in the country select search. */
  function onFilterCountries(query: string) {
    filterQuery.value = query
  }

  /** Converts the current national number and selected country into an E.164 string. */
  function buildE164(): string {
    const digits = nationalNumber.value.replaceAll(/\D/g, '')

    if (digits === '') {
      return ''
    }

    const parsed = parsePhoneNumberFromString(digits, { defaultCountry: selectedCountry.value })

    if (parsed !== undefined) {
      return parsed.format('E.164')
    }

    const dialCode = getCountryCallingCode(selectedCountry.value)
    return `+${dialCode}${digits}`
  }

  /** Builds the E.164 value and writes it to the model ref. */
  function emitValue() {
    const e164 = buildE164()
    lastEmittedValue = e164
    model.value = e164
  }

  /** Parses an incoming E.164 value to extract the country and national number. */
  function parseModelValue(value: string) {
    if (value === '' || value === null || value === undefined) {
      nationalNumber.value = ''
      return
    }

    const parsed = parsePhoneNumberFromString(value)

    if (parsed !== undefined) {
      selectedCountry.value = parsed.country ?? options.pDefaultCountry
      nationalNumber.value = parsed.formatNational()
    }
  }

  /** Resets the country filter and re-emits the value when the user picks a different country. */
  function onCountryChange() {
    filterQuery.value = ''
    emitValue()
  }

  watch(nationalNumber, () => {
    emitValue()
  })

  watch(() => model.value, (newValue) => {
    if (newValue === lastEmittedValue) {
      return
    }

    parseModelValue(newValue)
  }, { immediate: true })

  return {
    selectedCountry,
    nationalNumber,
    displayNumber,
    countryOptions,
    filteredCountries,
    onFilterCountries,
    onCountryChange,
  }
}
