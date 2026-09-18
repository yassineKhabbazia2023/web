import type { PTagProps } from '@pulse/styleguide/types'
import { DEFAULT_OFFER_TAG_COLOR } from '@pulse/styleguide/constants'

export const DEFAULT_TAG_PROPS: Omit<PTagProps, 'pContent'> = {
  pColor: DEFAULT_OFFER_TAG_COLOR,
}
