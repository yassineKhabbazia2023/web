import type { Document } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'
import type { IconName, PTagProps } from '@pulse/styleguide/types'

export interface PiaStatusTag {
  iconName: IconName
  type: PTagProps['pColor']
}

export interface DocumentDetailsTabPaneProps {
  document: Document
  selectedEntity: string
  accountId: number
  currentService: Service['ServiceId']
}
