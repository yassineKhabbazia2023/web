import type { Note } from '@/pages/subscriptions/SubscriptionsTypes'

export function getMockedStepNotes() {
  const notes: Note[] = [
    {
      stepName: 'services',
      stepNote: 'Test Note',
    },
    {
      stepName: 'customers',
      stepNote: 'Test Note',
    },
    {
      stepName: 'collaborators',
      stepNote: 'Test Note',
    },
    {
      stepName: 'information',
      stepNote: 'Test Note',
    },
  ]

  return notes
}
