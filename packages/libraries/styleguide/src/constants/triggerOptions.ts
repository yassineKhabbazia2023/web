import type { TooltipTriggerType } from 'element-plus'
import type { Arrayable, EpPropMergeType } from 'element-plus/es/utils'

const triggerOptions = [
  'hover',
  'contextmenu',
  'click',
  'focus',
] as const

export default triggerOptions

export type TriggerOptionsType = EpPropMergeType<
(new () => 'contextmenu' | 'click' | 'hover' | 'focus' | TooltipTriggerType[])
| (() => Arrayable<TooltipTriggerType>)
  , unknown, unknown
> | undefined
