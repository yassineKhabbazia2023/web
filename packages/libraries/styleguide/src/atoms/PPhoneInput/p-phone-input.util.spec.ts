import { getCountryName, buildCountryOptions, filterCountryOptions } from './p-phone-input.util'
import type { CountryOption } from './p-phone-input.types'

describe('p-phone-input.util', () => {
  describe('getCountryName', () => {
    it('should return the country name in French by default', () => {
      const name = getCountryName('FR')

      expect(name).toBe('France')
    })

    it('should return the country name in the specified locale', () => {
      const name = getCountryName('FR', 'en')

      expect(name).toBe('France')
    })

    it('should return a different name for non-French locale', () => {
      const name = getCountryName('DE', 'fr')

      expect(name).toBe('Allemagne')
    })

    it('should return the country name in English when specified', () => {
      const name = getCountryName('DE', 'en')

      expect(name).toBe('Germany')
    })

    it('should return a fallback value for unknown codes', () => {
      const name = getCountryName('ZZ')

      expect(name).toBeDefined()
      expect(name).not.toBe('')
    })
  })

  describe('buildCountryOptions', () => {
    it('should return all countries sorted alphabetically by French name', () => {
      const options = buildCountryOptions()

      expect(options.length).toBeGreaterThan(0)

      for (let i = 1; i < options.length; i++) {
        const previous = options[i - 1].name.localeCompare(options[i].name, 'fr')
        expect(previous).toBeLessThanOrEqual(0)
      }
    })

    it('should return options with code, name, and dialCode', () => {
      const options = buildCountryOptions()
      const france = options.find((option) => option.code === 'FR')

      expect(france).toBeDefined()
      expect(france?.name).toBe('France')
      expect(france?.dialCode).toBe('33')
    })

    it('should place preferred countries at the top of the list', () => {
      const preferred = ['BE', 'CH'] as const
      const options = buildCountryOptions([...preferred])

      expect(options[0].code).toBe('BE')
      expect(options[1].code).toBe('CH')
    })

    it('should not duplicate preferred countries in the rest of the list', () => {
      const preferred = ['FR', 'BE'] as const
      const options = buildCountryOptions([...preferred])
      const frOccurrences = options.filter((option) => option.code === 'FR')

      expect(frOccurrences).toHaveLength(1)
    })

    it('should return all countries when no preferred countries are provided', () => {
      const withEmpty = buildCountryOptions([])
      const withDefault = buildCountryOptions()

      expect(withEmpty.length).toBe(withDefault.length)
    })
  })

  describe('filterCountryOptions', () => {
    const mockOptions: CountryOption[] = [
      { code: 'FR', name: 'France', dialCode: '33' },
      { code: 'BE', name: 'Belgique', dialCode: '32' },
      { code: 'US', name: 'États-Unis', dialCode: '1' },
    ]

    it('should return all options when query is empty', () => {
      const result = filterCountryOptions(mockOptions, '')

      expect(result).toEqual(mockOptions)
    })

    it('should filter by country name (case-insensitive)', () => {
      const result = filterCountryOptions(mockOptions, 'france')

      expect(result).toHaveLength(1)
      expect(result[0].code).toBe('FR')
    })

    it('should filter by dial code', () => {
      const result = filterCountryOptions(mockOptions, '33')

      expect(result).toHaveLength(1)
      expect(result[0].code).toBe('FR')
    })

    it('should filter by country code (case-insensitive)', () => {
      const result = filterCountryOptions(mockOptions, 'be')

      expect(result).toHaveLength(1)
      expect(result[0].code).toBe('BE')
    })

    it('should return empty array when no match is found', () => {
      const result = filterCountryOptions(mockOptions, 'xyz')

      expect(result).toHaveLength(0)
    })

    it('should match partial country name', () => {
      const result = filterCountryOptions(mockOptions, 'belg')

      expect(result).toHaveLength(1)
      expect(result[0].code).toBe('BE')
    })
  })
})
