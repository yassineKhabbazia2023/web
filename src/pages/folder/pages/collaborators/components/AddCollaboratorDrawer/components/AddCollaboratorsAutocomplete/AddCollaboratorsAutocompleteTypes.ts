import type { Contact } from '@/services/contact/contactTypes'

export interface AddCollaboratorsAutocompleteProps {
  selectedCollaboratorsIds: Contact['id'][]
}
