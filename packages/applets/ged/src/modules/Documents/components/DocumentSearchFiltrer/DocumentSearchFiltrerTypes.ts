import type { DocumentSearchFilters } from '@/models/DocumentSearchFilters'

export interface DocumentSearchFiltrerProps {
  modelValue: boolean
  filters: DocumentSearchFilters | null
}
