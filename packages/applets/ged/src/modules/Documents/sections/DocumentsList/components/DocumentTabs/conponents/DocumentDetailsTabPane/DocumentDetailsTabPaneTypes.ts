import type { Document } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

// At the moment we're unable to correctly import the tag types without importing
// it from sources files so we need to use any
export interface PiaStatusTag {
  icon: any
  type: any
}

export interface DocumentDetailsTabPaneProps {
  document: Document
  selectedEntity: string
  currentService: Service['ServiceId']
}
