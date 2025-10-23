import { fetchCollaborators } from '@entities/services/offer'

export async function getAutocompleteContacts(
  selectedCollaboratorIds: number[],
  queryString: string,
) {
  if (!queryString) {
    return []
  }
  const autocompleteCollaborators = await fetchCollaborators(queryString) ?? []
  const collaborators = autocompleteCollaborators?.filter(({ id }) => selectedCollaboratorIds.indexOf(id) < 0)

  return collaborators
}
