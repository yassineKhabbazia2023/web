import { TEMPLATE_TYPE_SHORT_AUTRE } from '@/schedule/helpers/scheduleConsts'
import type { Schedule, Scheduling, Template }
  from '@/schedule/components/CreateSchedule/CreateScheduleForm/CreateScheduleFormModel'
import { recipientsIdCollection } from './Account'

const date = '2024-03-20'
const time = ''

export function getMockSchedule(): Schedule {
  const template: Template = {
    typeShort: 'TVA',
  }
  const scheduling: Scheduling = {
    date,
    time,
    frequency: 'None',
  }

  return {
    template,
    targets: recipientsIdCollection,
    scheduling,
    description: '',
    isDraft: false,
    isPrivate: false,
  }
}

export function getMonthlyMockSchedule(): Schedule {
  const template: Template = {
    typeShort: TEMPLATE_TYPE_SHORT_AUTRE,
    typeLong: 'IS',
  }
  const scheduling: Scheduling = {
    date,
    time,
    frequency: 'Monthly',
  }

  return {
    template,
    targets: recipientsIdCollection,
    scheduling,
    description: '',
    isDraft: false,
    isPrivate: false,
  }
}

export function getMockedSchedule(override: Partial<Schedule> = {}) {
  const template = {
    typeShort: '',
    typeLong: '',
  }

  const defaultDeadline: Schedule = {
    template,
    targets: recipientsIdCollection,
    scheduling: {
      date,
      time,
      frequency: 'Monthly',
    },
    description: '',
    isDraft: false,
    isPrivate: false,
  }
  return {
    ...defaultDeadline,
    ...override,
  }
}

export const frequenciesMock: string[] = ['Monthly', 'None']
