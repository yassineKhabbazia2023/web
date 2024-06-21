import type { ScheduleApiQueryParams } from '@/schedule/services/scheduleServiceTypes'

export interface Filters {
  targets: ScheduleApiQueryParams['targets']
  templates: ScheduleApiQueryParams['templates']
  status: ScheduleApiQueryParams['status']
  mineOnly: ScheduleApiQueryParams['mineOnly']
}

export interface FilterDrawerProps extends Filters {
  modelValue: boolean
  isCollab: boolean
}
