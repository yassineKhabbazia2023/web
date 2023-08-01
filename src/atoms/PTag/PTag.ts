import type { TagProps } from 'element-plus'
import type { EpPropMergeType } from 'element-plus/es/utils'

export interface PTagProps extends Omit<TagProps, 'type'> {
  type: EpPropMergeType<
    readonly [NumberConstructor, StringConstructor],
    ''
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'persian'
    | 'fuschia'
    | 'cyan'
    | 'amethyste'
    | 'gray-300'
    | 'gray-500'
    | 'gray-900',
    unknown
  >
}
