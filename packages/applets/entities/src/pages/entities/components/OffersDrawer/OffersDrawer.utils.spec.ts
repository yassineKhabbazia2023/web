import { getSubscriptionOffersServiceMock } from '@entities/__mocks__/offer-subscription.mocks'
import { OffersDrawerStep } from './OffersDrawer.enums'
import { getMockedPrincipalContacts } from '@entities/__mocks__/principal-contact.mocks'
import { ClientContact } from '../PrincipalContact/PrincipalContactTypes'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'

import {
  getHasNoSignatory,
  getIsNoCollaboratorSelected,
  getIsAllCollaboratorRoleSelected,
  getIsMissingCollaboratorRole,
  getIsNextButtonDisabled,
} from './OffersDrawer.utils'

const roleIdMock = 17
const mockedCollaborators = getMockedCollaborators()
const selectedCollaboratorIdsMock = mockedCollaborators.map(({ id: contactId }) => ({
  contactId,
  roleIds: [roleIdMock],
}))

const principalContactsMock = getMockedPrincipalContacts()
const currentSubscriptionOfferMock = getSubscriptionOffersServiceMock()

describe('test OffersDrawer.utils', () => {
  describe('getHasNoSignatory', () => {
    describe('when no principal contacts', () => {
      const principalContacts: ClientContact[] = []
      const tests = [{
        currentStep: OffersDrawerStep.CUSTOMERS,
        approvalRequired: false,
        expected: true,
      }, {
        currentStep: OffersDrawerStep.COLLABORATORS,
        approvalRequired: false,
        expected: true,
      }, {
        currentStep: OffersDrawerStep.CUSTOMERS,
        approvalRequired: true,
        expected: true,
      }, {
        currentStep: OffersDrawerStep.COLLABORATORS,
        approvalRequired: true,
        expected: false,
      }]
      it.each(tests)(
        'should return $expected when approvalRequired is $approvalRequired and currentStep is $currentStep', ({
          currentStep,
          approvalRequired,
          expected,
        }) => {
          const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
            approvalRequired,
          })
          const hasNoSignatory = getHasNoSignatory(
            currentStep,
            principalContacts,
            currentSubscriptionOffer,
          )
          expect(hasNoSignatory).toBe(expected)

        })
    })

    describe('when SOME principal contacts', () => {
      const principalContacts = principalContactsMock
      const tests = [{
        currentStep: OffersDrawerStep.CUSTOMERS,
        approvalRequired: false,
        expected: false,
      }, {
        currentStep: OffersDrawerStep.COLLABORATORS,
        approvalRequired: false,
        expected: false,
      }, {
        currentStep: OffersDrawerStep.CUSTOMERS,
        approvalRequired: true,
        expected: false,
      }, {
        currentStep: OffersDrawerStep.COLLABORATORS,
        approvalRequired: true,
        expected: false,
      }]
      it.each(tests)(
        'should return $expected when approvalRequired is $approvalRequired and currentStep is $currentStep', ({
          currentStep,
          approvalRequired,
          expected,
        }) => {
          const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
            approvalRequired,
          })
          const hasNoSignatory = getHasNoSignatory(
            currentStep,
            principalContacts,
            currentSubscriptionOffer,
          )
          expect(hasNoSignatory).toBe(expected)

        })
    })
  })

  describe('getIsNoCollaboratorSelected', () => {
    const tests = [{
      currentStep: OffersDrawerStep.COLLABORATORS,
      selectedCollaboratorsWithRoles: [],
      expected: true,
      reason: 'currentStep is COLLABORATORS and no collaborator selected',
    }, {
      currentStep: OffersDrawerStep.CUSTOMERS,
      selectedCollaboratorsWithRoles: [],
      expected: false,
      reason: 'currentStep is CUSTOMERS and no collaborator selected',
    }, {
      currentStep: OffersDrawerStep.COLLABORATORS,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMock,
      expected: false,
      reason: 'currentStep is COLLABORATORS and SOME collaborator selected',
    }, {
      currentStep: OffersDrawerStep.CUSTOMERS,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMock,
      expected: false,
      reason: 'currentStep is CUSTOMERS and SOME collaborator selected',
    }]
    it.each(tests)('should return $exected when $reason', ({
      currentStep,
      selectedCollaboratorsWithRoles,
      expected,
    }) => {
      const isNoCollaboratorSelected = getIsNoCollaboratorSelected(
        currentStep,
        selectedCollaboratorsWithRoles,
      )
      expect(isNoCollaboratorSelected).toBe(expected)
    })
  })

  describe('getIsAllCollaboratorRoleSelected', () => {
    const tests = [{
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      selectedCollaboratorsWithRoles: [{
        contactId: 1,
        roleIds: [roleIdMock],
      }],
      expected: true,
      reason: 'all collaboratorRoles are selected',
    }, {
      currentSubscriptionOffer: getSubscriptionOffersServiceMock({ functions: [] }),
      selectedCollaboratorsWithRoles: [],
      expected: true,
      reason: 'no collaboratorRoles is required because functions is empty',
    }, {
      currentSubscriptionOffer: getSubscriptionOffersServiceMock({ functions: undefined }),
      selectedCollaboratorsWithRoles: [],
      expected: true,
      reason: 'no collaboratorRoles is required because functions is undefined',
    }, {
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMock,
      expected: false,
      reason: 'not same number of collaboratorRoles and selectedCollaboratorsWithRoles',
    }]
    it.each(tests)('should return $expected when $reason', ({
      currentSubscriptionOffer,
      selectedCollaboratorsWithRoles,
      expected,
    }) => {
      const isNotCollaboratorRoleAffected = getIsAllCollaboratorRoleSelected(
        currentSubscriptionOffer,
        selectedCollaboratorsWithRoles,
      )
      expect(isNotCollaboratorRoleAffected).toBe(expected)
    })
  })

  describe('getIsMissingCollaboratorRole', () => {
    const selectedCollaboratorIdsMock = [{
      contactId: 1,
      roleIds: [roleIdMock],
    }]
    const selectedCollaboratorIdsMockWithMissingRoles = [{
      contactId: 1,
      roleIds: [roleIdMock],
    }, {
      contactId: 1,
      roleIds: [],
    }]

    const tests = [{
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMock,
      expected: false,
      reason: 'all collaboratorRoles has a role',
    }, {
      currentSubscriptionOffer: getSubscriptionOffersServiceMock({ functions: [] }),
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMockWithMissingRoles,
      expected: false,
      reason: 'no collaboratorRoles is required because functions is empty',
    }, {
      currentSubscriptionOffer: getSubscriptionOffersServiceMock({ functions: undefined }),
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMockWithMissingRoles,
      expected: false,
      reason: 'no collaboratorRoles is required because functions is undefined',
    }, {
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMockWithMissingRoles,
      expected: true,
      reason: 'role is missing for one collaborator',
    }]
    it.each(tests)('should return $expected when $reason', ({
      currentSubscriptionOffer,
      selectedCollaboratorsWithRoles,
      expected,
    }) => {
      const isNotCollaboratorRoleAffected = getIsMissingCollaboratorRole(
        currentSubscriptionOffer,
        selectedCollaboratorsWithRoles,
      )
      expect(isNotCollaboratorRoleAffected).toBe(expected)
    })
  })

  describe('getIsNextButtonDisabled', () => {
    const tests = [{
      currentSubscriptionOffer: undefined,
      currentStep: OffersDrawerStep.COLLABORATORS,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMock,
      principalContacts: principalContactsMock,
      expected: true,
      reason: 'currentSubscriptionOffer is undefined',
    }, {
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      currentStep: OffersDrawerStep.CUSTOMERS,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMock,
      principalContacts: [],
      expected: true,
      reason: 'has no signatory',
    }, {
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      currentStep: OffersDrawerStep.COLLABORATORS,
      selectedCollaboratorsWithRoles: [],
      principalContacts: principalContactsMock,
      expected: true,
      reason: 'no collaborator is selected',
    }, {
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      currentStep: OffersDrawerStep.COLLABORATORS,
      selectedCollaboratorsWithRoles: [{
        contactId: 1,
        roleIds: [roleIdMock],
      }, {
        contactId: 2,
        roleIds: [],
      }],
      principalContacts: principalContactsMock,
      expected: true,
      reason: 'role is missong for one collaborator',
    }, {
      currentSubscriptionOffer: currentSubscriptionOfferMock,
      currentStep: OffersDrawerStep.COLLABORATORS,
      selectedCollaboratorsWithRoles: [{
        contactId: 1,
        roleIds: [roleIdMock],
      }],
      principalContacts: principalContactsMock,
      expected: false,
      reason: 'nominal case',
    }]
    it.each(tests)('should return $expected when $reason', ({
      currentSubscriptionOffer,
      currentStep,
      selectedCollaboratorsWithRoles,
      principalContacts,
      expected,
    }) => {
      const isNextButtonDisabled = getIsNextButtonDisabled({
        currentSubscriptionOffer,
        currentStep,
        selectedCollaboratorsWithRoles,
        principalContacts,
      })
      expect(isNextButtonDisabled).toBe(expected)
    })
  })
})
