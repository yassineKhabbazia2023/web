import {
  WORK_ITEM_TYPE_COLORS,
  WORK_ITEM_STATE_COLORS,
  WORK_ITEM_COMPLETED_STATES,
} from '@backoffice/constants/azure-devops.const'
import type { TagColor } from './mep-planner.type'

export const getTypeColor = (type: string): TagColor => {
  return (WORK_ITEM_TYPE_COLORS as Record<string, TagColor>)[type] ?? 'gray'
}

export const getStateColor = (state: string): TagColor => {
  return (WORK_ITEM_STATE_COLORS as Record<string, TagColor>)[state] ?? 'gray'
}

export const isWorkItemIncomplete = (state: string): boolean => {
  return WORK_ITEM_COMPLETED_STATES.includes(state as typeof WORK_ITEM_COMPLETED_STATES[number]) === false
}

export const getRowClassName = ({ row }: { row: { state: string } }): string => {
  return isWorkItemIncomplete(row.state) === true ? 'mep-planner-work-items-table__row--incomplete' : ''
}
