import type { Contact } from '@entities/services/contact/contactTypes'
import { fetchCollaborators } from '@entities/services/offer'

export async function getAutocompleteContacts(
  selectedCollaborators: Contact[],
  queryString: string,
) {
  if (!queryString) {
    return []
  }
  const selectedCollaboratorsIds = selectedCollaborators.map(({ id }) => id)
  const autocompleteCollaborators = await fetchCollaborators(queryString) ?? []
  const collaborators = autocompleteCollaborators?.filter(({ id }) => selectedCollaboratorsIds.indexOf(id) < 0)

  return collaborators
}
