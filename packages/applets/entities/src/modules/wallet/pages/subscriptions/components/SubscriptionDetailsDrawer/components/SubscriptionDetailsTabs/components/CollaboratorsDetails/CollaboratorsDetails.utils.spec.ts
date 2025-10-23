import { getCollaboratorRoleMock, getSubscriptionContactMock } from '@entities/__mocks__/offer-subscription.mocks'
import { getFormattedCollaborators, getFormattedCollaboratorRoles } from './CollaboratorsDetails.utils'

const collaboratorRoleMock = getCollaboratorRoleMock()
const collaboratorRolesMock = [collaboratorRoleMock]

describe('test CollaboratorsDetails.utils', () => {
  describe('getFormattedCollaborators', () => {
    const tests = [{
      functionId1: collaboratorRoleMock.functionId,
      functionId2: collaboratorRoleMock.functionId + 1,
      reason: 'some collaboratorRoles',
    }, {
      functionId1: undefined,
      functionId2: undefined,
      reason: 'no collaboratorRoles',
    }]
    it.each(tests)('should return formatted collaborators when $reason', ({
      functionId1,
      functionId2,
    }) => {
      const subscriptionContactMock1 = getSubscriptionContactMock({ functionId: functionId1 })
      const subscriptionContactMock2 = getSubscriptionContactMock({ functionId: functionId2 })
      const subscriptionContactMocks = [
        subscriptionContactMock1,
        subscriptionContactMock2,
      ]

      const expectedFormattedCollaborator = {
        contactId: subscriptionContactMock1.contactId,
        firstName: subscriptionContactMock1.firstName,
        lastName: subscriptionContactMock1.lastName,
        email: subscriptionContactMock1.email,
        functionIds: functionId1 ? [functionId1, functionId2] : [],
      }
      const expectedFormattedCollaboratorRoles = [
        expectedFormattedCollaborator,
      ]

      const formattedCollaboratorRole = getFormattedCollaborators(
        subscriptionContactMocks,
      )
      expect(formattedCollaboratorRole).toStrictEqual(expectedFormattedCollaboratorRoles)
    })
  })

  describe('getFormattedCollaboratorRoles', () => {
    it('should return formatted collaborator roles', () => {
      const formattedCollaboratorRoles = getFormattedCollaboratorRoles(collaboratorRolesMock)
      const expectedFormattedCollaboratorRoles = [{
        pValue: collaboratorRoleMock.functionId,
        pLabel: collaboratorRoleMock.functionName,
      }]

      expect(formattedCollaboratorRoles).toStrictEqual(expectedFormattedCollaboratorRoles)
    })
  })
})
