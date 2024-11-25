export type CellNumberState = 'initial' | 'inactive' | 'active' | 'current'

export interface PCalendarCellNumberProps {
  // This prop is meant for display purposes only.
  // Since no calculation is involved,  a string is acceptable too
  pNumber: number | string
  pState: CellNumberState
}
