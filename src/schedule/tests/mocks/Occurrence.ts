import type { Occurrence } from '@/schedule/models/Deadline'

export function getMockedOccurrence(override: Partial<Occurrence> = {}): Occurrence {
  const defaultOccurrence: Occurrence = {
    id: 61,
    occurrenceDate: '05/01/2024 00:00:00',
    schedule: {
      id: 49,
      description: '',
      attachment: null,
      frequency: 'None',
      reminders: [],
      createdBy: {
        id: 209,
        firstName: 'a',
        lastName: 'a',
        email: 'clementprati@kpmg.fr',
      },
    },
    template: {
      typeShort: 'CRL',
      typeShortCustomer: 'CRL',
      typeShortCollaborator: 'CRL',
      typeLong: 'Contribution sur les revenus locatifs',
    },
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
