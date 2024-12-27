import type { Document, DocumentsTableStructure } from '@ged/models/Document'
import type { IconName, PTagProps } from '@pulse/styleguide/types'

export interface TableElementPops {
  fieldType: DocumentsTableStructure['fieldType']
  fieldName: DocumentsTableStructure['columnName']
  data: Document
  isInSearchScope?: boolean
}

export interface PiaStatusTag {
  iconName: IconName
  type: PTagProps['pColor']
}
