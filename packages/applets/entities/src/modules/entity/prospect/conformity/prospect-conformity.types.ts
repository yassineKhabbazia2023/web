import type { PCompletionTrackerListItemStatus } from '@pulse/styleguide/types'
import type { ProspectConformitySection } from './prospect-conformity.enums'

export interface ProspectConformityItem {
  id: string
  label: string
  status: PCompletionTrackerListItemStatus
  section: ProspectConformitySection
  secondaryText?: string
}
