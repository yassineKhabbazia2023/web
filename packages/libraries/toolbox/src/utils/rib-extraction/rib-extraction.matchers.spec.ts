import {
  ibanMatcher,
  bicMatcher,
  ribComponentsMatcher,
  bankCodeMatcher,
  branchCodeMatcher,
  accountNumberMatcher,
  ribKeyMatcher,
} from './rib-extraction.matchers'

describe('ibanMatcher', () => {
  describe('extract', () => {
    it('should extract IBAN with "IBAN:" prefix', () => {
      expect(ibanMatcher.extract('IBAN: FR7630001007941234567890185')).toBe('FR7630001007941234567890185')
      expect(ibanMatcher.extract('IBAN : FR7630001007941234567890185')).toBe('FR7630001007941234567890185')
      expect(ibanMatcher.extract('IBAN-FR7630001007941234567890185')).toBe('FR7630001007941234567890185')
    })

    it('should extract IBAN with spaces', () => {
      expect(ibanMatcher.extract('FR76 3000 1007 9412 3456 7890 185')).toBe('FR7630001007941234567890185')
      expect(ibanMatcher.extract('IBAN FR76 3000 1007 9412 3456 7890 185')).toBe('FR7630001007941234567890185')
    })

    it('should extract IBAN without prefix', () => {
      expect(ibanMatcher.extract('FR7630001007941234567890185')).toBe('FR7630001007941234567890185')
    })

    it('should extract IBAN from longer text', () => {
      const text = 'Votre IBAN est FR7630001007941234567890185 pour effectuer le virement'
      expect(ibanMatcher.extract(text)).toBe('FR7630001007941234567890185')
    })

    it('should handle mixed alphanumeric IBAN', () => {
      expect(ibanMatcher.extract('FR76 2004 1000 0106 7514 1E02 059')).toBe('FR7620041000010675141E02059')
    })

    it('should return null for non-French IBAN', () => {
      expect(ibanMatcher.extract('DE89370400440532013000')).toBeNull()
    })

    it('should return null for invalid text', () => {
      expect(ibanMatcher.extract('No IBAN here')).toBeNull()
      expect(ibanMatcher.extract('')).toBeNull()
    })
  })

  describe('normalize', () => {
    it('should remove spaces and uppercase', () => {
      expect(ibanMatcher.normalize!('fr76 3000 1007 9412 3456 7890 185')).toBe('FR7630001007941234567890185')
    })
  })
})

describe('bicMatcher', () => {
  describe('extract', () => {
    it('should extract BIC with "BIC:" prefix', () => {
      expect(bicMatcher.extract('BIC: BNPAFRPP')).toBe('BNPAFRPP')
      expect(bicMatcher.extract('BIC : BNPAFRPP')).toBe('BNPAFRPP')
      expect(bicMatcher.extract('BIC-BNPAFRPP')).toBe('BNPAFRPP')
    })

    it('should extract BIC with parenthetical explanation', () => {
      expect(bicMatcher.extract('BIC (Bank Identifier Code) PSSTFRPPMAR')).toBe('PSSTFRPPMAR')
      expect(bicMatcher.extract('BIC (Code bancaire) SOGEFRPP')).toBe('SOGEFRPP')
    })

    it('should extract 8-character BIC', () => {
      expect(bicMatcher.extract('BNPAFRPP')).toBe('BNPAFRPP')
      expect(bicMatcher.extract('SOGEFRPP')).toBe('SOGEFRPP')
      expect(bicMatcher.extract('CMCIFR2A')).toBe('CMCIFR2A')
    })

    it('should extract 11-character BIC', () => {
      expect(bicMatcher.extract('BNPAFRPPXXX')).toBe('BNPAFRPPXXX')
      expect(bicMatcher.extract('PSSTFRPPMAR')).toBe('PSSTFRPPMAR')
    })

    it('should extract BIC from longer text', () => {
      const text = 'Le code BIC de votre banque est BNPAFRPP'
      expect(bicMatcher.extract(text)).toBe('BNPAFRPP')
    })

    it('should extract SWIFT labeled BIC', () => {
      expect(bicMatcher.extract('SWIFT: BNPAFRPP')).toBe('BNPAFRPP')
      expect(bicMatcher.extract('SWIFT : SOGEFRPP')).toBe('SOGEFRPP')
    })

    it('should return null for invalid BIC', () => {
      expect(bicMatcher.extract('BNPAFR')).toBeNull()
      expect(bicMatcher.extract('No BIC here')).toBeNull()
      expect(bicMatcher.extract('')).toBeNull()
    })
  })

  describe('normalize', () => {
    it('should remove spaces and uppercase', () => {
      expect(bicMatcher.normalize!('bnpa frpp')).toBe('BNPAFRPP')
    })
  })
})

describe('ribComponentsMatcher', () => {
  describe('extract', () => {
    it('should extract La Banque Postale CLE RIB format', () => {
      const text = 'CLE RIB 20041 00001 0675141E020 59'
      const result = ribComponentsMatcher.extract(text)

      expect(result).toEqual({
        bankCode: '20041',
        branchCode: '00001',
        accountNumber: '0675141E020',
        ribKey: '59',
      })
    })

    it('should extract Clé RIB format (with accent)', () => {
      const text = 'Clé RIB 30001 00794 12345678901 85'
      const result = ribComponentsMatcher.extract(text)

      expect(result).toEqual({
        bankCode: '30001',
        branchCode: '00794',
        accountNumber: '12345678901',
        ribKey: '85',
      })
    })

    it('should extract format with CENTRE FINANCIER suffix', () => {
      const text = '20041 00001 0675141E020 59 CENTRE FINANCIER'
      const result = ribComponentsMatcher.extract(text)

      expect(result).toEqual({
        bankCode: '20041',
        branchCode: '00001',
        accountNumber: '0675141E020',
        ribKey: '59',
      })
    })

    it('should extract generic 5-5-11-2 format', () => {
      const text = '30001 00794 12345678901 85'
      const result = ribComponentsMatcher.extract(text)

      expect(result).toEqual({
        bankCode: '30001',
        branchCode: '00794',
        accountNumber: '12345678901',
        ribKey: '85',
      })
    })

    it('should uppercase account number', () => {
      const text = 'CLE RIB 20041 00001 0675141e020 59'
      const result = ribComponentsMatcher.extract(text)

      expect(result?.accountNumber).toBe('0675141E020')
    })

    it('should return null for invalid format', () => {
      expect(ribComponentsMatcher.extract('No RIB here')).toBeNull()
      expect(ribComponentsMatcher.extract('30001 00794 123456789 85')).toBeNull()
      expect(ribComponentsMatcher.extract('')).toBeNull()
    })
  })
})

describe('bankCodeMatcher', () => {
  it('should extract bank code with label', () => {
    expect(bankCodeMatcher.extract('Code banque: 30001')).toBe('30001')
    expect(bankCodeMatcher.extract('Code banque : 30001')).toBe('30001')
  })

  it('should extract from ETABLISSEMENT GUICHET format', () => {
    expect(bankCodeMatcher.extract('ETABLISSEMENT GUICHET 30001')).toBe('30001')
  })

  it('should return null for invalid format', () => {
    expect(bankCodeMatcher.extract('No code here')).toBeNull()
  })
})

describe('branchCodeMatcher', () => {
  it('should extract branch code with label', () => {
    expect(branchCodeMatcher.extract('Code guichet: 00794')).toBe('00794')
    expect(branchCodeMatcher.extract('Code agence : 00794')).toBe('00794')
  })

  it('should return null for invalid format', () => {
    expect(branchCodeMatcher.extract('No code here')).toBeNull()
  })
})

describe('accountNumberMatcher', () => {
  it('should extract account number with label', () => {
    expect(accountNumberMatcher.extract('Numéro de compte: 12345678901')).toBe('12345678901')
    expect(accountNumberMatcher.extract('Numéro de compte : 0675141E020')).toBe('0675141E020')
  })

  it('should return null for invalid format', () => {
    expect(accountNumberMatcher.extract('No number here')).toBeNull()
  })
})

describe('ribKeyMatcher', () => {
  it('should extract RIB key with label', () => {
    expect(ribKeyMatcher.extract('Clé RIB: 85')).toBe('85')
    expect(ribKeyMatcher.extract('Clé RIB : 59')).toBe('59')
  })

  it('should return null for invalid format', () => {
    expect(ribKeyMatcher.extract('No key here')).toBeNull()
  })
})
