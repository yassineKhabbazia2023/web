import { expect, describe, it, vi, type MockInstance, beforeEach } from 'vitest'
import { getMockedCollaborators } from '@entities/services/contact/contactMocks'
import * as OfferService from '@entities/services/offer'

import { getAutocompleteContacts } from './CollaboratorAutocompleteUtils'

const mockedCollaborators = getMockedCollaborators()
const selectedCollaborators = mockedCollaborators.slice(1, 2)
const searchExpression = 'search'

vi.mock('@entities/services/offer', () => ({
  fetchCollaborators: vi.fn(() => Promise.resolve(mockedCollaborators)),
}))

describe('test CollaboratorAutocompleteUtils', () => {
  let fetchCollaboratorsSpy: MockInstance
  beforeEach(() => {
    fetchCollaboratorsSpy = vi.spyOn(OfferService, 'fetchCollaborators')
  })

  it('should call getCollaboratorsSpy with proper arguments', async () => {
    await getAutocompleteContacts(selectedCollaborators, searchExpression)
    expect(fetchCollaboratorsSpy).toHaveBeenCalledOnce()
    expect(fetchCollaboratorsSpy).toHaveBeenNthCalledWith(1, searchExpression)
  })

  it('should return collaborators except selected one', async () => {
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaborators, searchExpression)
    expect(autocompleteContacts).toHaveLength(mockedCollaborators.length - selectedCollaborators.length)
  })

  it('should return empty array when getCollaborators returns undefined', async () => {
    fetchCollaboratorsSpy.mockResolvedValueOnce(undefined)
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaborators, searchExpression)
    expect(autocompleteContacts).toHaveLength(0)
  })

  it('should not call getCollaborators when searchExpression is empty', async () => {
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaborators, '')
    expect(fetchCollaboratorsSpy).not.toHaveBeenCalledOnce()
    expect(autocompleteContacts).toMatchObject([])
  })
})
