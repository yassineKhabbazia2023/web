import type { CountryCode } from 'libphonenumber-js'

export interface CountryOption {
  code: CountryCode
  name: string
  dialCode: string
}

export interface PPhoneInputProps {
  pDefaultCountry?: CountryCode
  pDisabled?: boolean
  pCountryDisabled?: boolean
  pPlaceholder?: string
  pPreferredCountries?: CountryCode[]
}

export interface UsePhoneInputOptions {
  pDefaultCountry: CountryCode
  pCountryDisabled: boolean
  pPreferredCountries: CountryCode[]
}
