import { expect, describe, it, vi, type SpyInstance, beforeEach } from 'vitest'
import { getMockedCollaborators } from '@/services/contact/contactMocks'
import * as ServiceContact from '@/services/contact'

import { getAutocompleteContacts } from './CollaboratorAutocompleteUtils'

const mockedCollaborators = getMockedCollaborators()
const selectedCollaborators = mockedCollaborators.slice(1, 2)
const searchExpression = 'search'

vi.mock('@/services/contact', () => ({
  getCollaborators: vi.fn(() => Promise.resolve(mockedCollaborators))
}))

describe('test CollaboratorAutocompleteUtils', () => {
  let getCollaboratorsSpy: SpyInstance
  beforeEach(() => {
    getCollaboratorsSpy = vi.spyOn(ServiceContact, 'getCollaborators')
  })

  it('should call getCollaboratorsSpy with proper arguments', async () => {
    await getAutocompleteContacts(selectedCollaborators, searchExpression)
    expect(getCollaboratorsSpy).toHaveBeenCalledOnce()
    expect(getCollaboratorsSpy).toHaveBeenNthCalledWith(1, searchExpression)
  })

  it('should return collaborators except selected one', async () => {
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaborators, searchExpression)
    expect(autocompleteContacts).toHaveLength(mockedCollaborators.length - selectedCollaborators.length)
  })

  it('should return empty array when getCollaborators returns undefined', async () => {
    getCollaboratorsSpy.mockResolvedValueOnce(undefined)
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaborators, searchExpression)
    expect(autocompleteContacts).toHaveLength(0)
  })

  it('should not call getCollaborators when searchExpression is empty', async () => {
    const autocompleteContacts = await getAutocompleteContacts(selectedCollaborators, '')
    expect(getCollaboratorsSpy).not.toHaveBeenCalledOnce()
    expect(autocompleteContacts).toMatchObject([])
  })
})
