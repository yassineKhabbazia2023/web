import { RibExtractionService } from './rib-extraction.service'

describe('RibExtractionService', () => {
  describe('extract', () => {
    it('should extract IBAN from text with label', () => {
      const text = 'IBAN : FR76 3000 1007 9412 3456 7890 185'
      const result = RibExtractionService.extract(text)

      expect(result.iban).toBe('FR7630001007941234567890185')
      expect(result.validation.ibanValid).toBe(true)
      expect(result.validation.ibanChecksum).toBe(true)
    })

    it('should extract IBAN without label', () => {
      const text = 'Voici votre IBAN FR7630001007941234567890185 pour le virement'
      const result = RibExtractionService.extract(text)

      expect(result.iban).toBe('FR7630001007941234567890185')
    })

    it('should extract BIC from text with label', () => {
      const text = 'BIC : BNPAFRPP'
      const result = RibExtractionService.extract(text)

      expect(result.bic).toBe('BNPAFRPP')
      expect(result.validation.bicValid).toBe(true)
    })

    it('should extract BIC with parenthetical explanation', () => {
      const text = 'BIC (Bank Identifier Code) PSSTFRPPMAR'
      const result = RibExtractionService.extract(text)

      expect(result.bic).toBe('PSSTFRPPMAR')
    })

    it('should extract complete RIB line (La Banque Postale format)', () => {
      const text = 'CLE RIB 20041 00001 0675141E020 59'
      const result = RibExtractionService.extract(text)

      expect(result.bankCode).toBe('20041')
      expect(result.branchCode).toBe('00001')
      expect(result.accountNumber).toBe('0675141E020')
      expect(result.ribKey).toBe('59')
    })

    it('should derive RIB components from IBAN', () => {
      const text = 'IBAN: FR7630001007941234567890185'
      const result = RibExtractionService.extract(text)

      expect(result.bankCode).toBe('30001')
      expect(result.branchCode).toBe('00794')
      expect(result.accountNumber).toBe('12345678901')
      expect(result.ribKey).toBe('85')
    })

    it('should handle complex La Banque Postale format', () => {
      const text = `
        RELEVE D'IDENTITE BANCAIRE
        BIC (Bank Identifier Code) PSSTFRPPMAR
        IBAN FR76 2004 1000 0106 7514 1E02 059
        CLE RIB 20041 00001 0675141E020 59
        JEAN DUPONT
        123 RUE DE LA PAIX
        75001 PARIS
      `
      const result = RibExtractionService.extract(text)

      expect(result.iban).toBe('FR7620041000010675141E02059')
      expect(result.bic).toBe('PSSTFRPPMAR')
      expect(result.bankCode).toBe('20041')
      expect(result.branchCode).toBe('00001')
      expect(result.accountNumber).toBe('0675141E020')
      expect(result.ribKey).toBe('59')
    })

    it('should calculate confidence score based on data completeness', () => {
      const fullText = 'IBAN: FR7630001007941234567890185 BIC: BNPAFRPP'
      const fullResult = RibExtractionService.extract(fullText)
      expect(fullResult.confidence).toBeGreaterThan(0.3)

      const partialText = 'Some random text'
      const partialResult = RibExtractionService.extract(partialText)
      expect(partialResult.confidence).toBe(0)
    })

    it('should return empty result for text with no banking data', () => {
      const text = 'This is just some random text without any banking information'
      const result = RibExtractionService.extract(text)

      expect(result.iban).toBeUndefined()
      expect(result.bic).toBeUndefined()
      expect(result.bankCode).toBeUndefined()
      expect(result.confidence).toBe(0)
    })
  })

  describe('deriveRibFromIban', () => {
    it('should derive RIB components from valid French IBAN', () => {
      const result = RibExtractionService.deriveRibFromIban('FR7630001007941234567890185')

      expect(result.bankCode).toBe('30001')
      expect(result.branchCode).toBe('00794')
      expect(result.accountNumber).toBe('12345678901')
      expect(result.ribKey).toBe('85')
    })

    it('should handle IBAN with spaces', () => {
      const result = RibExtractionService.deriveRibFromIban('FR76 3000 1007 9412 3456 7890 185')

      expect(result.bankCode).toBe('30001')
      expect(result.branchCode).toBe('00794')
    })

    it('should return empty object for non-French IBAN', () => {
      const result = RibExtractionService.deriveRibFromIban('DE89370400440532013000')

      expect(result).toEqual({})
    })

    it('should return empty object for invalid length', () => {
      const result = RibExtractionService.deriveRibFromIban('FR7630001')

      expect(result).toEqual({})
    })
  })
})
