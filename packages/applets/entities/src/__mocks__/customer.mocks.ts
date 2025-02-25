import type { Contact } from '@entities/services/contact/contactTypes'
import type { Persona } from '@pulse/common/types'

export function getMockedCustomer(): Contact[] {
  return [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'yve',
      email: 'yve@test.fr',
      landPhone: '0674589003',
      mobilePhone: '0785667003',
      type: 'Customer',
      office: undefined,
      persona: {
        id: 2,
        name: 'Dirigeant',
        description: '',
      } as Persona,
    },
    {
      id: 2,
      firstName: 'Bernard',
      lastName: 'yve',
      email: 'bernard@test.fr',
      landPhone: '0674589003',
      mobilePhone: '0785667003',
      type: 'Customer',
      office: undefined,
      persona: {
        id: 2,
        name: 'Comptable',
        description: '',
      } as Persona,
    },
  ]
}
