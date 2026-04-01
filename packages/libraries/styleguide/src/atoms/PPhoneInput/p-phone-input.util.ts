import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js'
import type { CountryOption } from './p-phone-input.types'

/**
 * Returns the localized display name for a given ISO 3166-1 country code.
 * Falls back to the raw code if the locale cannot resolve the name.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g. "FR", "US")
 * @param locale - BCP 47 locale used for translation (defaults to "fr")
 */
export function getCountryName(countryCode: string, locale = 'fr'): string {
  const displayNames = new Intl.DisplayNames([locale], { type: 'region' })
  return displayNames.of(countryCode) ?? countryCode
}

/**
 * Builds a sorted list of country options for the phone input select.
 * Preferred countries are placed at the top, the rest are sorted alphabetically.
 *
 * @param preferredCountries - Country codes to display first in the list
 */
export function buildCountryOptions(preferredCountries: CountryCode[] = []): CountryOption[] {
  const countries = getCountries()

  const options: CountryOption[] = countries.map((code) => ({
    code,
    name: getCountryName(code),
    dialCode: getCountryCallingCode(code),
  }))

  options.sort((a, b) => a.name.localeCompare(b.name, 'fr'))

  if (preferredCountries.length === 0) {
    return options
  }

  const preferred = preferredCountries
    .map((code) => options.find((option) => option.code === code))
    .filter((option): option is CountryOption => option !== undefined)

  const rest = options.filter((option) => preferredCountries.includes(option.code) === false)

  return [...preferred, ...rest]
}

/**
 * Filters country options by matching the query against the country name, dial code, or ISO code.
 *
 * @param options - Full list of country options to filter
 * @param query - Search string entered by the user
 */
export function filterCountryOptions(options: CountryOption[], query: string): CountryOption[] {
  if (query === '') {
    return options
  }

  const normalizedQuery = query.toLowerCase()

  return options.filter((country) =>
    country.name.toLowerCase().includes(normalizedQuery)
    || country.dialCode.includes(normalizedQuery)
    || country.code.toLowerCase().includes(normalizedQuery),
  )
}
