import type { Contact } from '@entities/services/contact/contactTypes'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import type { ContactWithRoles } from './ManageCollaboratorsTypes'
import { ContactType } from '@pulse/common/enums'
import { getCollaboratorRoleMock } from '@entities/__mocks__/offer-subscription.mocks'

import { getFormattedCollaborators, getFormattedCollaborator, getUserActionOptions } from './ManageCollaborators.utils'

const knownCollaborators: Contact[] = getMockedCollaborators()
const unknownCollaboratorId = 9999

function getContactWithFunctionMock(contactId: number) {
  return {
    contactId,
    roleIds: [],
  }
}

const collaboratorRoleMock = getCollaboratorRoleMock()

describe('test ManageCollaborators.utils', () => {
  describe('getFormattedCollaborators', () => {
    it('should return an array of collaborators matching the given IDs', () => {
      const collaboratorA = knownCollaborators.at(0)!
      const collaboratorB = knownCollaborators.at(2)!
      const selectedCollaboratorsWithRoles = [
        getContactWithFunctionMock(collaboratorA.id),
        getContactWithFunctionMock(collaboratorB.id),
      ]
      const expectedFormattedCollaborators = [{
        ...collaboratorA,
        fullName: `${collaboratorA.firstName} ${collaboratorA.lastName}`,
        profile: 'EW',
        role: collaboratorA.persona!.name,
        type: ContactType.COLLABORATOR,
        dataTestId: `offer-selected-collaborator-${collaboratorA.email}`,
        roleIds: [],
        availableRoles: [],
      }, {
        ...collaboratorB,
        fullName: `${collaboratorB.firstName} ${collaboratorB.lastName}`,
        profile: 'SM',
        role: collaboratorB.persona!.name,
        type: ContactType.COLLABORATOR,
        dataTestId: `offer-selected-collaborator-${collaboratorB.email}`,
        roleIds: [],
        availableRoles: [],
      }]
      const result = getFormattedCollaborators(knownCollaborators, selectedCollaboratorsWithRoles, [])

      expect(result).toEqual(expectedFormattedCollaborators)
    })

    it('should return an empty array if no IDs match', () => {
      const selectedCollaboratorsWithRoles = [getContactWithFunctionMock(unknownCollaboratorId)]
      const result = getFormattedCollaborators(knownCollaborators, selectedCollaboratorsWithRoles, [])

      expect(result).toEqual([])
    })

    it('should return an empty array if selectedCollaboratorsWithRoles is empty', () => {
      const selectedCollaboratorsWithRoles: ContactWithRoles[] = []
      const result = getFormattedCollaborators(knownCollaborators, selectedCollaboratorsWithRoles, [])

      expect(result).toEqual([])
    })

    it('should ignore IDs that do not match any known collaborators', () => {
      const firstCollaborators = knownCollaborators.at(0)!
      const selectedCollaboratorsWithRoles = [
        getContactWithFunctionMock(firstCollaborators.id),
        getContactWithFunctionMock(unknownCollaboratorId),
      ]
      const expectedFormattedCollaborators = [{
        ...firstCollaborators,
        fullName: `${firstCollaborators.firstName} ${firstCollaborators.lastName}`,
        profile: 'EW',
        role: firstCollaborators.persona!.name,
        type: ContactType.COLLABORATOR,
        dataTestId: `offer-selected-collaborator-${firstCollaborators.email}`,
        roleIds: [],
        availableRoles: [],
      }]
      const result = getFormattedCollaborators(knownCollaborators, selectedCollaboratorsWithRoles, [])

      expect(result).toEqual(expectedFormattedCollaborators)
    })
  })

  describe('getFormattedCollaborator', () => {
    it('should return properly formatted collaborator without collaboratorRoles', () => {
      const collaboratorA = knownCollaborators.at(0)!
      const selectedCollaboratorId = getContactWithFunctionMock(collaboratorA.id)
      const expectedFormattedCollaborator = {
        ...collaboratorA,
        fullName: `${collaboratorA.firstName} ${collaboratorA.lastName}`,
        profile: 'EW',
        role: collaboratorA.persona!.name,
        type: ContactType.COLLABORATOR,
        dataTestId: `offer-selected-collaborator-${collaboratorA.email}`,
        roleIds: [],
        availableRoles: [],
      }
      const result = getFormattedCollaborator(knownCollaborators, selectedCollaboratorId, [], [])

      expect(result).toEqual(expectedFormattedCollaborator)
    })

    it('should return properly formatted collaborator with collaboratorRoles', () => {
      const collaboratorA = knownCollaborators.at(0)!
      const selectedCollaboratorId = getContactWithFunctionMock(collaboratorA.id)
      const expectedAvailableRoles = [{
        pValue: collaboratorRoleMock.functionId,
        pLabel: collaboratorRoleMock.functionName,
      }]
      const usedCollaboratorRoleMock = getCollaboratorRoleMock({ functionId: 2 })
      const collaboratorRolesMock = [
        collaboratorRoleMock,
        usedCollaboratorRoleMock,
      ]
      const usedCollaboratorRoleIds = [usedCollaboratorRoleMock.functionId]
      const expectedFormattedCollaborator = {
        ...collaboratorA,
        fullName: `${collaboratorA.firstName} ${collaboratorA.lastName}`,
        profile: 'EW',
        role: '',
        type: ContactType.COLLABORATOR,
        dataTestId: `offer-selected-collaborator-${collaboratorA.email}`,
        roleIds: [],
        availableRoles: expectedAvailableRoles,
      }
      const result = getFormattedCollaborator(knownCollaborators, selectedCollaboratorId, collaboratorRolesMock, usedCollaboratorRoleIds)

      expect(result).toEqual(expectedFormattedCollaborator)
    })
  })

  describe('getUserActionOptions', () => {
    it('should return filtered and fomatted options', () => {
      const usedCollaboratorRoleMock = getCollaboratorRoleMock({ functionId: 2 })
      const collaboratorRolesMock = [
        collaboratorRoleMock,
        usedCollaboratorRoleMock,
      ]
      const usedCollaboratorRoleIds = [usedCollaboratorRoleMock.functionId]

      const expectedUserActionOptions = [{
        pValue: collaboratorRoleMock.functionId,
        pLabel: collaboratorRoleMock.functionName,
      }]
      const userActionOptions = getUserActionOptions(collaboratorRolesMock, usedCollaboratorRoleIds)

      expect(userActionOptions).toStrictEqual(expectedUserActionOptions)
    })
  })
})
