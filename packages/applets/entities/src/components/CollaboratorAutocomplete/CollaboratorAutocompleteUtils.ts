import { fetchCollaborators } from '@entities/services/collaborator'

export async function getAutocompleteContacts(
  selectedCollaboratorIds: number[],
  queryString: string,
) {
  if (!queryString) {
    return []
  }
  const autocompleteCollaborators = await fetchCollaborators(queryString) ?? []
  const collaborators = autocompleteCollaborators?.filter(({ id }) => selectedCollaboratorIds.includes(id) === false)

  return collaborators
}
