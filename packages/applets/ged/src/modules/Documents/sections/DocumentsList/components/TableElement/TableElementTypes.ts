import type { TableRowDocument, DocumentsTableStructure } from '@ged/models/Document'
import type { IconName, PTagProps } from '@pulse/styleguide/types'

export interface TableElementPops {
  fieldType: DocumentsTableStructure['fieldType']
  fieldName: DocumentsTableStructure['columnName']
  data: TableRowDocument
  isInSearchScope?: boolean
}

export interface PiaStatusTag {
  iconName: IconName
  type: PTagProps['pColor']
}
