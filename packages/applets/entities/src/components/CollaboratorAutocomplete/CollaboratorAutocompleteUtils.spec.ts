import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { fetchCollaborators } from '@entities/services/collaborator'

import { getAutocompleteContacts } from './CollaboratorAutocompleteUtils'

const mockedCollaborators = getMockedCollaborators()
const selectedCollaboratorIds = mockedCollaborators.slice(1, 2).map(({ id }) => id)
const searchExpression = 'search'

const fetchCollaboratorsSpy = vi.mocked(fetchCollaborators)

describe('test CollaboratorAutocompleteUtils', () => {
  beforeEach(() => {
    fetchCollaboratorsSpy.mockResolvedValue(mockedCollaborators)
  })

  it('should call getCollaboratorsSpy with proper arguments', async () => {
    await getAutocompleteContacts(selectedCollaboratorIds, searchExpression)
    expect(fetchCollaboratorsSpy).toHaveBeenCalledOnce()
    expect(fetchCollaboratorsSpy).toHaveBeenNthCalledWith(1, searchExpression)
  })

  it('should return collaborators except selected one', async () => {
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaboratorIds, searchExpression)
    expect(autocompleteContacts).toHaveLength(mockedCollaborators.length - selectedCollaboratorIds.length)
  })

  it('should return empty array when getCollaborators returns undefined', async () => {
    fetchCollaboratorsSpy.mockResolvedValueOnce(undefined)
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaboratorIds, searchExpression)
    expect(autocompleteContacts).toHaveLength(0)
  })

  it('should not call getCollaborators when searchExpression is empty', async () => {
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaboratorIds, '')
    expect(fetchCollaboratorsSpy).not.toHaveBeenCalledOnce()
    expect(autocompleteContacts).toMatchObject([])
  })
})
