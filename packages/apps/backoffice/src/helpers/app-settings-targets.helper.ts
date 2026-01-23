export type TargetValueMap = Record<string, string>

export interface AppSettingTargetPayload {
  environment: string
  label: string
  value: string
}

const SEPARATOR = ':'

/**
 * Converts a map of targetKey -> value into API targets.
 *
 * targetKey formats:
 * - "ITG"       → environment only (label will be empty)
 * - "PRD:prd01" → environment + label
 *
 * Empty or whitespace-only values are ignored.
 *
 * @example
 * Input:
 * {
 *   ITG: "value1",
 *   "PRD:prd01": "value2",
 *   REC: "   "
 * }
 *
 * Output:
 * [
 *   { environment: "ITG", label: "", value: "value1" },
 *   { environment: "PRD", label: "prd01", value: "value2" }
 * ]
 */
export function buildTargetsFromValues(
  valuesByTarget: TargetValueMap | undefined,
): AppSettingTargetPayload[] {
  return Object.entries(valuesByTarget ?? {})
    .map(([key, rawValue]) => {
      const value = rawValue.trim()
      if (value.length === 0) {
        return null
      }

      const sepIndex = key.indexOf(SEPARATOR)
      if (sepIndex !== -1) {
        const environment = key.slice(0, sepIndex)
        const label = key.slice(sepIndex + 1)
        return { environment, label, value }
      }

      // env-only: label must be empty (backend expects empty label for env target)
      return { environment: key, label: '', value }
    })
    .filter(
      // Type guard: removes null entries and narrows the array type for TypeScript
      (x): x is AppSettingTargetPayload => x !== null,
    )
}
