import { getSubscriptionOffersServiceMock } from '@entities/__mocks__/offer-subscription.mocks'
import { OffersDrawerStep } from '@entities/enums'
import { getClientContactMock, getMockedPrincipalContacts } from '@entities/__mocks__/principal-contact.mocks'
import { ClientContact } from '@entities/types'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { type PatchValue } from '@entities/services/PatchRecordService'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import { SubscriptionOfferCode } from '@pulse/common/enums'

import {
  getHasNoSignatory,
  signatoryMissingPhone,
  getIsNoCollaboratorSelected,
  getIsAllCollaboratorRoleSelected,
  getIsMissingCollaboratorRole,
  getIsNextButtonDisabled,
  updateAccountOnInput,
} from './OffersDrawer.utils'

const addPathValueMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/PatchRecordService/PatchRecordService', () => ({
  addPathValue: addPathValueMock,
}))

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

  describe('signatoryMissingPhone', () => {
    describe('when principal contact has missing phone (empty string)', () => {
      const principalContactsWithMissingPhone: ClientContact[] = [
        getClientContactMock({ mobilePhone: '' }),
      ]

      it('should return true when offerCode is PENNYLANE and currentStep is CUSTOMERS', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: SubscriptionOfferCode.PENNYLANE,
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          principalContactsWithMissingPhone,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(true)
      })

      it('should return false when offerCode is PENNYLANE but currentStep is not CUSTOMERS', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: SubscriptionOfferCode.PENNYLANE,
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.SERVICES,
          principalContactsWithMissingPhone,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(false)
      })

      it('should return false when offerCode is not PENNYLANE', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: 'MEG Smart',
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          principalContactsWithMissingPhone,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(false)
      })
    })

    describe('when principal contact has phone number', () => {
      const principalContactsWithPhone: ClientContact[] = [
        getClientContactMock({ mobilePhone: '0612345678' }),
      ]

      it('should return false even when offerCode is PENNYLANE and currentStep is CUSTOMERS', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: SubscriptionOfferCode.PENNYLANE,
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          principalContactsWithPhone,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(false)
      })

      it('should return false when offerCode is not PENNYLANE', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: 'MEG Smart',
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          principalContactsWithPhone,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(false)
      })
    })

    describe('when no principal contacts', () => {
      const principalContacts: ClientContact[] = []

      it('should return false when no contacts exist even for PENNYLANE offer', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: SubscriptionOfferCode.PENNYLANE,
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          principalContacts,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(false)
      })
    })

    describe('when some contacts have missing phone and some have phone', () => {
      const mixedPrincipalContacts: ClientContact[] = [
        getClientContactMock({ contactId: 1, mobilePhone: '0612345678' }),
        getClientContactMock({ contactId: 2, mobilePhone: '' }),
      ]

      it('should return true when offerCode is PENNYLANE, currentStep is CUSTOMERS and at least one contact has missing phone', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: SubscriptionOfferCode.PENNYLANE,
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          mixedPrincipalContacts,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(true)
      })

      it('should return false when offerCode is not PENNYLANE even if contact has missing phone', () => {
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: 'MEG Smart',
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          mixedPrincipalContacts,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(false)
      })
    })

    describe('when mobilePhone is undefined or null', () => {
      it('should return true when mobilePhone is undefined and offerCode is PENNYLANE on CUSTOMERS step', () => {
        const principalContactsWithUndefinedPhone: ClientContact[] = [
          getClientContactMock({ mobilePhone: undefined }),
        ]
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: SubscriptionOfferCode.PENNYLANE,
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          principalContactsWithUndefinedPhone,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(true)
      })

      it('should return true when mobilePhone is null and offerCode is PENNYLANE on CUSTOMERS step', () => {
        const principalContactsWithNullPhone: ClientContact[] = [
          getClientContactMock({ mobilePhone: null as unknown as string }),
        ]
        const currentSubscriptionOffer = getSubscriptionOffersServiceMock({
          offerCode: SubscriptionOfferCode.PENNYLANE,
        })
        const hasMissingPhone = signatoryMissingPhone(
          OffersDrawerStep.CUSTOMERS,
          principalContactsWithNullPhone,
          currentSubscriptionOffer,
        )
        expect(hasMissingPhone).toBe(true)
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
      currentSubscriptionOffer: getSubscriptionOffersServiceMock({ offerCode: SubscriptionOfferCode.PENNYLANE }),
      currentStep: OffersDrawerStep.CUSTOMERS,
      selectedCollaboratorsWithRoles: selectedCollaboratorIdsMock,
      principalContacts: [getClientContactMock({ mobilePhone: '' })],
      expected: true,
      reason: 'signatory has missing phone number for PENNYLANE offer',
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

  describe('updateAccountOnInput', () => {
    it('should update account.value and call addPathValue properly', () => {
      const accountMock = getMockedAccount()

      const fieldKey: string = 'commercialName'
      const fieldValue: any = 'My Company'
      const account = accountMock
      const patchValues: PatchValue[] = []

      const expectedParams = [
        patchValues,
        fieldKey,
        accountMock.commercialName,
        fieldValue,
      ]
      const expectedAccount = {
        ...accountMock,
        commercialName: fieldValue,
      }

      const updatedAccount = updateAccountOnInput(
        fieldKey,
        fieldValue,
        patchValues,
        account,
      )
      expect(addPathValueMock).toHaveBeenCalledExactlyOnceWith(...expectedParams)
      expect(updatedAccount).toStrictEqual(expectedAccount)
    })
  })
})
