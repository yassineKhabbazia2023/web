export interface RibData {
  iban?: string
  bic?: string
  bankCode?: string
  branchCode?: string
  accountNumber?: string
  ribKey?: string
}

export interface RibValidation {
  ibanValid: boolean
  ibanChecksum: boolean
  bicValid: boolean
  ribKeyValid: boolean
}

export interface RibExtractionResult extends RibData {
  validation: RibValidation
  confidence: number
}

export interface RibComponents {
  bankCode: string
  branchCode: string
  accountNumber: string
  ribKey: string
}

export interface TextMatcher<T> {
  name: string
  patterns: RegExp[]
  extract(text: string): T | null
  normalize?(value: T): T
}

export interface MatcherConfig {
  name: string
  patterns: RegExp[]
  /** Normalizes raw matched string */
  normalize?(value: string): string
  /** If true, use match[0] as fallback when match[1] is not available */
  allowFullMatchFallback?: boolean
}
