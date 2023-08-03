import type { AvatarProps } from 'element-plus'
import type { EpPropMergeType } from 'element-plus/es/utils'

export interface PAvatarProps extends Omit<AvatarProps, 'size'> {
  size: EpPropMergeType<
    readonly [NumberConstructor, StringConstructor],
    '' | 'default' | 'small' | 'large' | 'xsmall' | 'xlarge',
    number
  >
  color: string
}
