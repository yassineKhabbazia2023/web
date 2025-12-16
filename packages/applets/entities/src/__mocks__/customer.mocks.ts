import type { Contact } from '@entities/services/contact/contactTypes'
import type { Persona } from '@pulse/common/types'
import { ContactType } from '@pulse/common/enums'

export function getMockedCustomer(): Contact[] {
  return [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.fr',
      landPhone: '0674589003',
      mobilePhone: '0785667003',
      type: ContactType.CUSTOMER,
      office: undefined,
      persona: {
        id: 2,
        name: 'Dirigeant',
        description: '',
      } as Persona,
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@test.fr',
      landPhone: '0674589003',
      mobilePhone: '0785667003',
      type: ContactType.CUSTOMER,
      office: undefined,
      persona: {
        id: 2,
        name: 'Comptable',
        description: '',
      } as Persona,
    },
  ]
}
