import type { IndicatorSign, ValueKind } from '@key-moments/enums/key-moments.enums'

export type IndicatorDrawerMode = 'create' | 'edit'

export interface IndicatorForm {
  code: string
  label: string
  shortLabel: string
  kind: ValueKind
  sign: IndicatorSign
}
