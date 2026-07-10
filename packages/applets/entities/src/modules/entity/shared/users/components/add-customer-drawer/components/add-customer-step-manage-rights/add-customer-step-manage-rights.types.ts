import type { Contact } from '../../add-customer-drawer.types'

export interface AddCustomerStepManageRightsProps {
  newContact: Contact
  contactId: number
  entityId: number
  accountNumber: string
  isProspect: boolean
}
