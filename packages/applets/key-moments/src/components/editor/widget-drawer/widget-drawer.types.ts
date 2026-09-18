/** A measure column, as the drawer edits it: a named key, or a role. */
export interface RawMeasure {
  measure?: string
  role?: string
  label?: string
  hidden?: boolean
}

export interface RawSeries {
  indicator: string
  color?: string
  type?: string
}

export interface RawGroup {
  label: string
  color?: string
  indicators: string[]
}

export interface RawChart {
  kind: string
  series?: RawSeries[]
  primaryAxisTitle?: string
  secondaryAxisTitle?: string
  periods?: string[]
  period?: string
  stacks?: string[]
  groups?: RawGroup[]
}

export interface RawCards {
  heroFirst?: true
  signColored?: true
  colored?: true
}
