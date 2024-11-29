import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'

export interface DocumentSearchFilterProps {
  modelValue: boolean
  filters: DocumentSearchFilters | null
}
