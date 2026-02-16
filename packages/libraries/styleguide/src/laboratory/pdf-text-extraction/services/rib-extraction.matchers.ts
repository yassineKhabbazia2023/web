import type { TextMatcher, RibComponents, MatcherConfig } from './rib-extraction.type'

const normalizeUtils = {
  upperCaseNoSpaces: (value: string): string => value.replaceAll(/\s/g, '').toUpperCase(),
  normalizeWhitespace: (text: string): string => text.replaceAll(/\s{1,100}/g, ' '),
}

/**
 * Creates a text matcher with configurable capture group handling.
 * This factory is designed for string matchers only (T = string).
 * For complex types like RibComponents, implement TextMatcher directly.
 * @param config - Matcher configuration
 * @param config.allowFullMatchFallback - When true, falls back to match[0] if match[1] is undefined
 */
function createMatcher(config: MatcherConfig): TextMatcher<string> {
  const { name, patterns, normalize, allowFullMatchFallback = false } = config

  const processValue = (raw: string): string => {
    return normalize ? normalize(raw) : raw
  }

  return {
    name,
    patterns,
    normalize,

    extract(text: string): string | null {
      const normalizedText = normalizeUtils.normalizeWhitespace(text)

      for (const pattern of patterns) {
        const match = pattern.exec(normalizedText)
        if (match) {
          const raw = allowFullMatchFallback ? (match[1] || match[0]) : match[1]
          if (raw) {
            return processValue(raw)
          }
        }
      }
      return null
    },
  }
}

export const ibanMatcher = createMatcher({
  name: 'iban',
  patterns: [
    /\b(FR\d{2}[A-Z0-9]{23})\b/,
    /\b(FR\d{2}\s\d{4}\s\d{4}\s\d{4}\s\d{4}\s\d{4}\s\d{3})\b/i,
    /\b(FR\d{2}\s\d{4}\s\d{4}\s\d{4}\s[0-9A-Z]{4}\s[0-9A-Z]{4}\s[0-9A-Z]{3})\b/i,
    /\bIBAN[\s:-]{0,3}(FR\d{2}(?:\s?[0-9A-Z]{4}){5}\s?[0-9A-Z]{3})(?![0-9A-Z])/i,
  ],
  normalize: normalizeUtils.upperCaseNoSpaces,
  allowFullMatchFallback: true,
})

export const bicMatcher = createMatcher({
  name: 'bic',
  patterns: [
    // French BIC patterns (prioritized) - 11 chars then 8 chars
    /\b([A-Z]{4}FR[A-Z0-9]{2}[A-Z0-9]{3})\b/,
    /\b([A-Z]{4}FR[A-Z0-9]{2})\b/,
    // Labeled BIC/SWIFT patterns (stricter: no words allowed between label and value)
    /\bBIC\s?(?:\([^)]{1,30}\))?\s?[:-]\s?([A-Z]{4}[A-Z]{2}[A-Z0-9]{2}(?:[A-Z0-9]{3})?)\b/i,
    /\bSWIFT[\s:-]{0,3}([A-Z]{4}[A-Z]{2}[A-Z0-9]{2}(?:[A-Z0-9]{3})?)\b/i,
  ],
  normalize: normalizeUtils.upperCaseNoSpaces,
  allowFullMatchFallback: true,
})

export const ribComponentsMatcher: TextMatcher<RibComponents> = {
  name: 'ribComponents',
  patterns: [
    /(?:CLE\s?RIB|Clé\s?RIB)\s(\d{5})\s(\d{5})\s([0-9A-Z]{11})\s(\d{2})/i,
    /(\d{5})\s(\d{5})\s([0-9A-Z]{11})\s(\d{2})\s(?:[A-Z]{1,30}[\s,]){0,5}(?:FINANCIER|CENTRE)/i,
    /Clé\s?RIB\s(?:Agence\sde\sdomiciliation\s)?(?:[A-Z']{1,30}\s){0,10}(\d{5})\s(\d{5})\s(\d{11})\s(\d{2})/i,
    /\b(\d{5})\s(\d{5})\s([0-9A-Z]{11})\s(\d{2})\b/,
  ],

  extract(text: string): RibComponents | null {
    const normalizedText = normalizeUtils.normalizeWhitespace(text)

    for (const pattern of this.patterns) {
      const match = pattern.exec(normalizedText)
      if (match?.[1] && match[2] && match[3] && match[4]) {
        return {
          bankCode: match[1],
          branchCode: match[2],
          accountNumber: match[3].toUpperCase(),
          ribKey: match[4],
        }
      }
    }
    return null
  },
}

export const bankCodeMatcher = createMatcher({
  name: 'bankCode',
  patterns: [
    /(?:Code\s?banque)[\s:-]{0,3}(\d{5})/i,
    /(?:ETABLISSEMENT)\s(?:GUICHET)\D{0,20}(\d{5})/i,
  ],
})

export const branchCodeMatcher = createMatcher({
  name: 'branchCode',
  patterns: [/(?:Code\s?(?:agence|guichet))[\s:-]{0,3}(\d{5})/i],
})

export const accountNumberMatcher = createMatcher({
  name: 'accountNumber',
  patterns: [/(?:Numéro\s?de\s?compte)[\s:-]{0,3}([0-9A-Z]{11})/i],
  normalize: (value: string) => value.toUpperCase(),
})

export const ribKeyMatcher = createMatcher({
  name: 'ribKey',
  patterns: [/(?:Clé\s?RIB)[\s:-]{0,3}(\d{2})\b/i],
})
