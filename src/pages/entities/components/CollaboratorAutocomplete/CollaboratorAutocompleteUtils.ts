import type { Contact } from '@/services/contact/contactTypes'
import { getCollaborators } from '@/services/contact'

export async function getAutocompleteContacts(
  selectedCollaborators: Contact[],
  queryString: string,
) {
  if (!queryString) {
    return []
  }
  const selectedCollaboratorsIds = selectedCollaborators.map(({ id }) => id)
  const autocompleteCollaborators = await getCollaborators(queryString) ?? []
  const collaborators = autocompleteCollaborators?.filter(({ id }) => selectedCollaboratorsIds.indexOf(id) < 0)

  return collaborators
}
