import type { Contact } from '@entities/services/contact/contactTypes'

export interface AddCollaboratorsAutocompleteProps {
  selectedCollaborators: Contact[]
  fetchCollaborators?: (search: string) => Promise<Contact[]>
  disabled?: boolean
}
