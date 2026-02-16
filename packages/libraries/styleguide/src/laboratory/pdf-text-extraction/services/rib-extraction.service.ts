import {
  isValidIbanFormat,
  isValidIbanChecksum,
  isValidBic,
  isValidRibKey,
} from '../utils/validators'
import type { RibData, RibValidation, RibExtractionResult } from './rib-extraction.type'
import {
  ibanMatcher,
  bicMatcher,
  ribComponentsMatcher,
  bankCodeMatcher,
  branchCodeMatcher,
  accountNumberMatcher,
  ribKeyMatcher,
} from './rib-extraction.matchers'
import { CONFIDENCE_WEIGHTS, RIB_COMPONENT_FIELDS, MAX_SCORE } from './rib-extraction.const'

export class RibExtractionService {
  static extract(text: string): RibExtractionResult {
    const data: RibData = {}

    const iban = ibanMatcher.extract(text)
    if (iban) {
      data.iban = iban
    }

    const bic = bicMatcher.extract(text)
    if (bic) {
      data.bic = bic
    }

    this.extractRibComponents(text, data)
    this.fillMissingFromIban(data)

    const validation = this.validate(data)
    const confidence = this.calculateConfidence(data, validation)

    return { ...data, validation, confidence }
  }

  private static extractRibComponents(text: string, data: RibData): void {
    const ribComponents = ribComponentsMatcher.extract(text)
    if (ribComponents) {
      for (const field of RIB_COMPONENT_FIELDS) {
        data[field] = ribComponents[field]
      }
      return
    }

    // Fall back to individual matchers
    const individualMatchers = {
      bankCode: bankCodeMatcher,
      branchCode: branchCodeMatcher,
      accountNumber: accountNumberMatcher,
      ribKey: ribKeyMatcher,
    } as const

    for (const field of RIB_COMPONENT_FIELDS) {
      const value = individualMatchers[field].extract(text)
      if (value) {
        data[field] = value
      }
    }
  }

  private static fillMissingFromIban(data: RibData): void {
    if (data.iban === undefined) {
      return
    }

    const derived = this.deriveRibFromIban(data.iban)
    for (const field of RIB_COMPONENT_FIELDS) {
      if (data[field] === undefined && derived[field]) {
        data[field] = derived[field]
      }
    }
  }

  static deriveRibFromIban(iban: string): Partial<RibData> {
    const normalized = iban.replaceAll(/\s/g, '').toUpperCase()

    if (!normalized.startsWith('FR') || normalized.length !== 27) {
      return {}
    }

    return {
      bankCode: normalized.substring(4, 9),
      branchCode: normalized.substring(9, 14),
      accountNumber: normalized.substring(14, 25),
      ribKey: normalized.substring(25, 27),
    }
  }

  private static validate(data: RibData): RibValidation {
    return {
      ibanValid: data.iban ? isValidIbanFormat(data.iban) : false,
      ibanChecksum: data.iban ? isValidIbanChecksum(data.iban) : false,
      bicValid: data.bic ? isValidBic(data.bic) : false,
      ribKeyValid: (data.bankCode && data.branchCode && data.accountNumber && data.ribKey)
        ? isValidRibKey(data.bankCode, data.branchCode, data.accountNumber, data.ribKey)
        : false,
    }
  }

  private static calculateConfidence(data: RibData, validation: RibValidation): number {
    let score = 0

    // IBAN scoring
    if (data.iban) {
      score += CONFIDENCE_WEIGHTS.IBAN_PRESENCE
      if (validation.ibanValid) {
        score += CONFIDENCE_WEIGHTS.IBAN_FORMAT_VALID
      }
      if (validation.ibanChecksum) {
        score += CONFIDENCE_WEIGHTS.IBAN_CHECKSUM_VALID
      }
    }

    // BIC scoring
    if (data.bic) {
      score += CONFIDENCE_WEIGHTS.BIC_PRESENCE
      if (validation.bicValid) {
        score += CONFIDENCE_WEIGHTS.BIC_FORMAT_VALID
      }
    }

    // RIB components scoring (iterate over fields)
    for (const field of RIB_COMPONENT_FIELDS) {
      if (data[field]) {
        score += CONFIDENCE_WEIGHTS.RIB_COMPONENT
      }
    }

    if (validation.ribKeyValid) {
      score += CONFIDENCE_WEIGHTS.RIB_KEY_VALID
    }

    return Math.round((score / MAX_SCORE) * 100) / 100
  }
}
