/* eslint-disable no-unused-vars */
export enum Period {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}

export interface DocumentSearchFilters {
  selectedPeriod: string | null
  startDate: Date | null
  endDate: Date | null
}
