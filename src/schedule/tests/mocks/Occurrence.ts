import type { Occurrence, Schedule, Template } from '@/schedule/models/Deadline'

export function getMockedScheduleOccurrence(override: Partial<Schedule> = {}): Schedule {
  const defaultSchedule: Schedule = {
    id: 49,
    description: '',
    attachment: {
      name: 'declaration_tva_mai_2024.pdf',
      content: 'data:application_pdf;base64,SGVsbG8g-d29ybGQ=',
    },
    frequency: 'None',
    reminders: [],
    createdBy: {
      id: 209,
      firstName: 'Jerry',
      lastName: 'Lewis',
      email: 'jerry.lewis@kpmg.test',
    },
  }
  return {
    ...defaultSchedule,
    ...override,
  }
}

export function getMockedTemplateOccurrence(override: Partial<Template> = {}): Template {
  const defaultTemplate: Template = {
    typeShort: 'CRL',
    typeShortCustomer: 'CRL',
    typeShortCollaborator: 'CRL',
    typeLong: 'Contribution sur les revenus locatifs',
  }

  return {
    ...defaultTemplate,
    ...override,
  }
}

export function getMockedOccurrence(override: Partial<Occurrence> = {}): Occurrence {
  const defaultOccurrence: Occurrence = {
    id: 61,
    occurrenceDate: '05/01/2024 00:00:00',
    schedule: getMockedScheduleOccurrence(),
    template: getMockedTemplateOccurrence(),
    globalStatus: 'Done',
    accountList: [
      {
        id: 102,
        name: 'Weyland Corporation',
        status: 'Done',
      },
    ],
  }

  return {
    ...defaultOccurrence,
    ...override,
  }
}
