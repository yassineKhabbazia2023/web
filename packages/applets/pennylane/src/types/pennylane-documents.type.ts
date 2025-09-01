import type { PennylaneDocument } from '@pulse/common/types'
import type { IconName } from '@pulse/styleguide/types'

export interface FormattedPennylaneDocument extends PennylaneDocument {
  iconName: IconName
}
