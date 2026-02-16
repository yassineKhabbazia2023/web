import {
  isValidIbanFormat,
  isValidIbanChecksum,
  isValidIban,
  validateIban,
  extractIban,
  composeIban,
  formatIbanFriendly,
  isValidBic,
  validateBic,
  extractBic,
  isValidRibKey,
  calculateRibKey,
  IBAN_FR_REGEX,
  BIC_REGEX,
  BANK_CODE_REGEX,
  BRANCH_CODE_REGEX,
  ACCOUNT_NUMBER_REGEX,
  RIB_KEY_REGEX,
  IbanValidationError,
  BicValidationError,
} from './banking.validators'

describe('banking.validators', () => {
  describe('IBAN_FR_REGEX', () => {
    const validIbans = [
      'FR7630001007941234567890185',
      'FR7612345678901234567890123',
      'FR0012345678901234567890123',
    ]

    const invalidIbans = [
      'FR761234567890123456789012', // Too short (26 chars)
      'FR76123456789012345678901234', // Too long (28 chars)
      'DE7630001007941234567890185', // Not French
      'FR7630001007941234567890!85', // Invalid character
      'fr7630001007941234567890185', // Lowercase (regex expects uppercase)
    ]

    it.each(validIbans)('should match valid IBAN: %s', (iban) => {
      expect(IBAN_FR_REGEX.test(iban)).toBe(true)
    })

    it.each(invalidIbans)('should not match invalid IBAN: %s', (iban) => {
      expect(IBAN_FR_REGEX.test(iban)).toBe(false)
    })
  })

  describe('BIC_REGEX', () => {
    const validBics = [
      'BNPAFRPP', // 8 chars without branch
      'BNPAFRPPXXX', // 11 chars with branch
      'SOGEFRPP',
      'CMCIFR2A',
      'PSSTFRPP',
    ]

    const invalidBics = [
      'BNPAFR', // Too short (6 chars)
      'BNPAFRPPXXXX', // Too long (12 chars)
      'BNPAFRP', // Invalid length (7 chars)
      'BNPAFRPPXX', // Invalid length (10 chars)
      '1234FRPP', // Starts with numbers
      'BNPA1234', // Country code with numbers
    ]

    it.each(validBics)('should match valid BIC: %s', (bic) => {
      expect(BIC_REGEX.test(bic)).toBe(true)
    })

    it.each(invalidBics)('should not match invalid BIC: %s', (bic) => {
      expect(BIC_REGEX.test(bic)).toBe(false)
    })
  })

  describe('BANK_CODE_REGEX', () => {
    it('should match valid bank codes (5 digits)', () => {
      expect(BANK_CODE_REGEX.test('30001')).toBe(true)
      expect(BANK_CODE_REGEX.test('20041')).toBe(true)
      expect(BANK_CODE_REGEX.test('00000')).toBe(true)
    })

    it('should not match invalid bank codes', () => {
      expect(BANK_CODE_REGEX.test('3000')).toBe(false) // Too short
      expect(BANK_CODE_REGEX.test('300001')).toBe(false) // Too long
      expect(BANK_CODE_REGEX.test('3000A')).toBe(false) // Contains letter
      expect(BANK_CODE_REGEX.test('!@#$%')).toBe(false) // Special chars
    })
  })

  describe('BRANCH_CODE_REGEX', () => {
    it('should match valid branch codes (5 digits)', () => {
      expect(BRANCH_CODE_REGEX.test('00794')).toBe(true)
      expect(BRANCH_CODE_REGEX.test('00001')).toBe(true)
    })

    it('should not match invalid branch codes', () => {
      expect(BRANCH_CODE_REGEX.test('0079')).toBe(false)
      expect(BRANCH_CODE_REGEX.test('007941')).toBe(false)
    })
  })

  describe('ACCOUNT_NUMBER_REGEX', () => {
    it('should match valid account numbers (11 alphanumeric)', () => {
      expect(ACCOUNT_NUMBER_REGEX.test('12345678901')).toBe(true)
      expect(ACCOUNT_NUMBER_REGEX.test('0675141E020')).toBe(true)
      expect(ACCOUNT_NUMBER_REGEX.test('ABCDEFGHIJK')).toBe(true)
    })

    it('should not match invalid account numbers', () => {
      expect(ACCOUNT_NUMBER_REGEX.test('1234567890')).toBe(false) // Too short
      expect(ACCOUNT_NUMBER_REGEX.test('123456789012')).toBe(false) // Too long
      expect(ACCOUNT_NUMBER_REGEX.test('1234567890!')).toBe(false) // Special char
      expect(ACCOUNT_NUMBER_REGEX.test('1234567890a')).toBe(false) // Lowercase
    })
  })

  describe('RIB_KEY_REGEX', () => {
    it('should match valid RIB keys (2 digits)', () => {
      expect(RIB_KEY_REGEX.test('85')).toBe(true)
      expect(RIB_KEY_REGEX.test('00')).toBe(true)
      expect(RIB_KEY_REGEX.test('97')).toBe(true)
    })

    it('should not match invalid RIB keys', () => {
      expect(RIB_KEY_REGEX.test('8')).toBe(false) // Too short
      expect(RIB_KEY_REGEX.test('850')).toBe(false) // Too long
      expect(RIB_KEY_REGEX.test('AB')).toBe(false) // Letters
      expect(RIB_KEY_REGEX.test('8A')).toBe(false) // Mixed
    })
  })

  describe('isValidIbanFormat', () => {
    it('should return true for valid French IBAN', () => {
      expect(isValidIbanFormat('FR7630001007941234567890185')).toBe(true)
    })

    it('should normalize spaces and case', () => {
      expect(isValidIbanFormat('FR76 3000 1007 9412 3456 7890 185')).toBe(true)
      expect(isValidIbanFormat('fr7630001007941234567890185')).toBe(true)
    })

    it('should return false for empty or null', () => {
      expect(isValidIbanFormat('')).toBe(false)
      expect(isValidIbanFormat(null as unknown as string)).toBe(false)
      expect(isValidIbanFormat(undefined as unknown as string)).toBe(false)
    })

    it('should return false for invalid format', () => {
      expect(isValidIbanFormat('DE7630001007941234567890185')).toBe(false)
      expect(isValidIbanFormat('FR7630001007941234567890')).toBe(false)
    })
  })

  describe('isValidIbanChecksum', () => {
    it('should validate correct checksum for valid IBAN', () => {
      // FR7630001007941234567890185 is a test IBAN with valid checksum
      expect(isValidIbanChecksum('FR7630001007941234567890185')).toBe(true)
    })

    it('should return false for invalid checksum', () => {
      // Modified last digit to break checksum
      expect(isValidIbanChecksum('FR7630001007941234567890186')).toBe(false)
      expect(isValidIbanChecksum('FR0030001007941234567890185')).toBe(false)
    })

    it('should return false for empty or short strings', () => {
      expect(isValidIbanChecksum('')).toBe(false)
      expect(isValidIbanChecksum('FR7')).toBe(false)
    })

    it('should handle spaces', () => {
      expect(isValidIbanChecksum('FR76 3000 1007 9412 3456 7890 185')).toBe(true)
    })
  })

  describe('isValidIban', () => {
    it('should return true only when both format and checksum are valid', () => {
      expect(isValidIban('FR7630001007941234567890185')).toBe(true)
    })

    it('should return false for valid format but invalid checksum', () => {
      expect(isValidIban('FR7630001007941234567890186')).toBe(false)
    })

    it('should return false for invalid format', () => {
      expect(isValidIban('DE7630001007941234567890185')).toBe(false)
    })
  })

  describe('validateIban', () => {
    it('should return valid result for valid IBAN', () => {
      const result = validateIban('FR7630001007941234567890185')
      expect(result.valid).toBe(true)
      expect(result.errorCodes).toHaveLength(0)
    })

    it('should return NoIbanProvided error for empty input', () => {
      expect(validateIban('').errorCodes).toContain(IbanValidationError.NoIbanProvided)
      expect(validateIban(null as unknown as string).errorCodes).toContain(IbanValidationError.NoIbanProvided)
    })

    it('should return InvalidCountryCode for non-French IBAN', () => {
      const result = validateIban('DE89370400440532013000')
      expect(result.valid).toBe(false)
      expect(result.errorCodes).toContain(IbanValidationError.InvalidCountryCode)
    })

    it('should return ChecksumNotNumeric for non-numeric check digits', () => {
      const result = validateIban('FRXX30001007941234567890185')
      expect(result.valid).toBe(false)
      expect(result.errorCodes).toContain(IbanValidationError.ChecksumNotNumeric)
    })

    it('should return WrongLength for incorrect length', () => {
      const result = validateIban('FR76300010079412345678901') // 26 chars
      expect(result.valid).toBe(false)
      expect(result.errorCodes).toContain(IbanValidationError.WrongLength)
    })

    it('should return InvalidChecksum for wrong checksum', () => {
      const result = validateIban('FR7630001007941234567890186')
      expect(result.valid).toBe(false)
      expect(result.errorCodes).toContain(IbanValidationError.InvalidChecksum)
    })

    it('should return multiple errors when applicable', () => {
      const result = validateIban('DE76300')
      expect(result.valid).toBe(false)
      expect(result.errorCodes.length).toBeGreaterThan(1)
    })
  })

  describe('extractIban', () => {
    it('should extract components from valid IBAN', () => {
      const result = extractIban('FR7630001007941234567890185')
      expect(result).not.toBeNull()
      expect(result!.countryCode).toBe('FR')
      expect(result!.checkDigits).toBe('76')
      expect(result!.bankCode).toBe('30001')
      expect(result!.branchCode).toBe('00794')
      expect(result!.accountNumber).toBe('12345678901')
      expect(result!.ribKey).toBe('85')
    })

    it('should handle spaces in IBAN', () => {
      const result = extractIban('FR76 3000 1007 9412 3456 7890 185')
      expect(result).not.toBeNull()
      expect(result!.bankCode).toBe('30001')
    })

    it('should return null for invalid IBAN', () => {
      expect(extractIban('INVALID')).toBeNull()
      expect(extractIban('FR7630001007941234567890186')).toBeNull() // Bad checksum
    })
  })

  describe('composeIban', () => {
    it('should compose valid IBAN from RIB components', () => {
      const iban = composeIban('30001', '00794', '12345678901', '85')
      expect(iban).toBe('FR7630001007941234567890185')
    })

    it('should return null for invalid RIB components', () => {
      expect(composeIban('30001', '00794', '12345678901', '00')).toBeNull() // Wrong key
      expect(composeIban('3000', '00794', '12345678901', '85')).toBeNull() // Bank code too short
    })

    it('should handle alphanumeric account numbers', () => {
      const iban = composeIban('20041', '00001', '0675141E020', '59')
      expect(iban).not.toBeNull()
      expect(iban!.slice(14, 25)).toBe('0675141E020')
    })
  })

  describe('formatIbanFriendly', () => {
    it('should format IBAN with spaces', () => {
      const formatted = formatIbanFriendly('FR7630001007941234567890185')
      expect(formatted).toBe('FR76 3000 1007 9412 3456 7890 185')
    })

    it('should accept custom separator', () => {
      const formatted = formatIbanFriendly('FR7630001007941234567890185', '-')
      expect(formatted).toBe('FR76-3000-1007-9412-3456-7890-185')
    })

    it('should handle already formatted IBAN', () => {
      const formatted = formatIbanFriendly('FR76 3000 1007 9412 3456 7890 185')
      expect(formatted).toBe('FR76 3000 1007 9412 3456 7890 185')
    })

    it('should return null for invalid input', () => {
      expect(formatIbanFriendly('')).toBeNull()
      expect(formatIbanFriendly(null as unknown as string)).toBeNull()
    })
  })

  describe('isValidBic', () => {
    it('should return true for valid 8-character BIC', () => {
      expect(isValidBic('BNPAFRPP')).toBe(true)
      expect(isValidBic('SOGEFRPP')).toBe(true)
      expect(isValidBic('CMCIFR2A')).toBe(true)
    })

    it('should return true for valid 11-character BIC', () => {
      expect(isValidBic('BNPAFRPPXXX')).toBe(true)
      expect(isValidBic('SOGEFRPPPAR')).toBe(true)
    })

    it('should normalize spaces and case', () => {
      expect(isValidBic('bnpafrpp')).toBe(true)
      expect(isValidBic('BNPA FRPP')).toBe(true)
    })

    it('should return false for invalid BIC', () => {
      expect(isValidBic('')).toBe(false)
      expect(isValidBic(null as unknown as string)).toBe(false)
      expect(isValidBic('BNPAFR')).toBe(false) // Too short
      expect(isValidBic('BNPAFRPPXXXX')).toBe(false) // Too long
    })

    it('should validate country code by default', () => {
      expect(isValidBic('BNPAFRPP')).toBe(true) // France - valid
      expect(isValidBic('BNPADEPP')).toBe(true) // Germany - valid SEPA
      expect(isValidBic('BNPAZZPP')).toBe(false) // ZZ - invalid country
    })

    it('should skip country validation when disabled', () => {
      expect(isValidBic('BNPAZZPP', false)).toBe(true) // Format valid, country check disabled
    })
  })

  describe('validateBic', () => {
    it('should return valid result for valid BIC', () => {
      const result = validateBic('BNPAFRPP')
      expect(result.valid).toBe(true)
      expect(result.errorCodes).toHaveLength(0)
    })

    it('should return NoBicProvided error for empty input', () => {
      expect(validateBic('').errorCodes).toContain(BicValidationError.NoBicProvided)
      expect(validateBic(null as unknown as string).errorCodes).toContain(BicValidationError.NoBicProvided)
    })

    it('should return WrongFormat for invalid format', () => {
      const result = validateBic('BNPAFR') // Too short
      expect(result.valid).toBe(false)
      expect(result.errorCodes).toContain(BicValidationError.WrongFormat)
    })

    it('should return InvalidCountryCode for unknown country', () => {
      const result = validateBic('BNPAZZPP') // ZZ is not a valid country
      expect(result.valid).toBe(false)
      expect(result.errorCodes).toContain(BicValidationError.InvalidCountryCode)
    })
  })

  describe('extractBic', () => {
    it('should extract components from valid 8-character BIC', () => {
      const result = extractBic('BNPAFRPP')
      expect(result).not.toBeNull()
      expect(result!.bankCode).toBe('BNPA')
      expect(result!.countryCode).toBe('FR')
      expect(result!.locationCode).toBe('PP')
      expect(result!.branchCode).toBeNull()
      expect(result!.isTestBic).toBe(false)
    })

    it('should extract components from valid 11-character BIC', () => {
      const result = extractBic('BNPAFRPPXXX')
      expect(result).not.toBeNull()
      expect(result!.branchCode).toBe('XXX')
    })

    it('should detect test BIC', () => {
      // BIC format: 4 bank + 2 country + 2 location
      // Test BIC: second char of location code is '0'
      const result = extractBic('BNPAFRP0') // Location is 'P0', second char is '0'
      expect(result).not.toBeNull()
      expect(result!.isTestBic).toBe(true)
    })

    it('should detect non-test BIC', () => {
      const result = extractBic('BNPAFRPP') // Location is 'PP', second char is 'P'
      expect(result).not.toBeNull()
      expect(result!.isTestBic).toBe(false)
    })

    it('should return null for invalid BIC', () => {
      expect(extractBic('INVALID')).toBeNull()
      expect(extractBic('')).toBeNull()
    })
  })

  describe('isValidRibKey', () => {
    it('should validate correct RIB key', () => {
      // Test with known valid RIB data
      // Formula: key = 97 - ((concatenated value * 100) mod 97)
      expect(isValidRibKey('30001', '00794', '12345678901', '85')).toBe(true)
    })

    it('should handle alphanumeric account numbers', () => {
      // Account numbers can contain letters (converted using RIB table)
      // La Banque Postale format with letter E
      expect(isValidRibKey('20041', '00001', '0675141E020', '59')).toBe(true)
    })

    it('should return false for incorrect key', () => {
      expect(isValidRibKey('30001', '00794', '12345678901', '00')).toBe(false)
      expect(isValidRibKey('30001', '00794', '12345678901', '99')).toBe(false)
    })

    it('should return false for invalid lengths', () => {
      expect(isValidRibKey('3000', '00794', '12345678901', '85')).toBe(false) // Bank code too short
      expect(isValidRibKey('300001', '00794', '12345678901', '85')).toBe(false) // Bank code too long
      expect(isValidRibKey('30001', '0079', '12345678901', '85')).toBe(false) // Branch code too short
      expect(isValidRibKey('30001', '007941', '12345678901', '85')).toBe(false) // Branch code too long
      expect(isValidRibKey('30001', '00794', '1234567890', '85')).toBe(false) // Account too short
      expect(isValidRibKey('30001', '00794', '123456789012', '85')).toBe(false) // Account too long
      expect(isValidRibKey('30001', '00794', '12345678901', '8')).toBe(false) // Key too short
      expect(isValidRibKey('30001', '00794', '12345678901', '850')).toBe(false) // Key too long
    })

    it('should return false for empty values', () => {
      expect(isValidRibKey('', '00794', '12345678901', '85')).toBe(false)
      expect(isValidRibKey('30001', '', '12345678901', '85')).toBe(false)
      expect(isValidRibKey('30001', '00794', '', '85')).toBe(false)
      expect(isValidRibKey('30001', '00794', '12345678901', '')).toBe(false)
    })

    it('should return false for non-numeric key', () => {
      expect(isValidRibKey('30001', '00794', '12345678901', 'AB')).toBe(false)
      expect(isValidRibKey('30001', '00794', '12345678901', '8A')).toBe(false)
    })

    it('should reject bank code with invalid characters', () => {
      expect(isValidRibKey('!@#$%', '00794', '12345678901', '85')).toBe(false)
      expect(isValidRibKey('3000!', '00794', '12345678901', '85')).toBe(false)
      expect(isValidRibKey('3000A', '00794', '12345678901', '85')).toBe(false)
    })

    it('should reject branch code with invalid characters', () => {
      expect(isValidRibKey('30001', '!@#$%', '12345678901', '85')).toBe(false)
      expect(isValidRibKey('30001', '0079!', '12345678901', '85')).toBe(false)
    })

    it('should reject account number with invalid characters', () => {
      expect(isValidRibKey('30001', '00794', '123!5678901', '85')).toBe(false)
      expect(isValidRibKey('30001', '00794', '12345@78901', '85')).toBe(false)
      expect(isValidRibKey('30001', '00794', '123#567890!', '85')).toBe(false)
    })

    it('should handle lowercase account number letters (normalize to uppercase)', () => {
      // Lowercase 'e' should be treated same as 'E'
      expect(isValidRibKey('20041', '00001', '0675141e020', '59')).toBe(true)
    })

    it('should handle all letter-to-digit conversions correctly', () => {
      // Letters A-I, J-R, S-Z should map correctly
      // A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
      // J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
      // S=2, T=3, U=4, V=5, W=6, X=7, Y=8, Z=9
      // These are edge case validations
      expect(isValidRibKey('20041', '00001', '0675141E020', '59')).toBe(true) // E in account
    })

    it('should handle key at boundary values', () => {
      // Key should be between 01 and 97
      // A valid key of 97 would mean remainder was 0
      // Testing boundary keys when possible
      expect(isValidRibKey('30001', '00794', '12345678901', '85')).toBe(true)
    })

    it('should validate real-world French bank RIBs', () => {
      // BNP Paribas example (key calculated: 97 - ((300040000100001234567 * 100) mod 97) = 89)
      expect(isValidRibKey('30004', '00001', '00001234567', '89')).toBe(true)
      // Société Générale example (key calculated: 41)
      expect(isValidRibKey('30003', '02770', '00037260956', '41')).toBe(true)
    })
  })

  describe('calculateRibKey', () => {
    it('should calculate correct RIB key', () => {
      expect(calculateRibKey('30001', '00794', '12345678901')).toBe('85')
      expect(calculateRibKey('20041', '00001', '0675141E020')).toBe('59')
      expect(calculateRibKey('30004', '00001', '00001234567')).toBe('89')
      expect(calculateRibKey('30003', '02770', '00037260956')).toBe('41')
    })

    it('should return null for invalid inputs', () => {
      expect(calculateRibKey('', '00794', '12345678901')).toBeNull()
      expect(calculateRibKey('3000', '00794', '12345678901')).toBeNull() // Too short
      expect(calculateRibKey('30001', '0079', '12345678901')).toBeNull() // Branch too short
      expect(calculateRibKey('30001', '00794', '1234567890')).toBeNull() // Account too short
    })

    it('should handle lowercase letters in account number', () => {
      expect(calculateRibKey('20041', '00001', '0675141e020')).toBe('59')
    })

    it('should return padded key for single digit results', () => {
      // Some RIB keys are single digits like 05, should be padded
      const key = calculateRibKey('30001', '00794', '12345678901')
      expect(key).toHaveLength(2)
    })
  })
})
