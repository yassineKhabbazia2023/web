import type { IndicatorSign, ValueKind } from '../enums/key-moments.enums'

export interface IndicatorRequest {
  code: string
  label: string
  shortLabel?: string
  /** Null clears the definition, whatever the update route merges or replaces */
  description: string | null
  kind: ValueKind
  sign: IndicatorSign
}

export type IndicatorUpdateRequest = Omit<IndicatorRequest, 'code'>

/** One template citing an indicator, as the usages route lists them. */
export interface IndicatorUsageItem {
  templateId: number
  code: string
  label: string
  /** Absent when the route names the citing template without listing its versions. */
  versions?: string[]
}
