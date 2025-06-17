import { expect, it, describe, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import type { SubscriptionContact } from '@entities/services/subscription/subscriptionTypes'
import { getMockedSubscriptionDetails } from '@entities/__mocks__/subscription.mocks'
import type { CollaboratorRole } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import { getCollaboratorRoleMock, getSubscriptionContactMock } from '@entities/__mocks__/offer-subscription.mocks'

import CollaboratorsDetails from '.'

const mockedSubscriptionCollaborators = getMockedSubscriptionDetails().collaborators

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(() => ''),
}))

function createWrapper(
  collaborators: SubscriptionContact[],
  collaboratorRoles: CollaboratorRole[],
) {
  return shallowMount(CollaboratorsDetails, {
    props: {
      collaborators,
      collaboratorRoles,
    },
  })
}

describe('collaboratorsDetails', () => {
  describe('display', () => {
    it('should correctly display when no collaboratorRoles', async () => {
      const wrapper = createWrapper(mockedSubscriptionCollaborators, [])

      await expect(wrapper.html()).toMatchFileSnapshot('__snap__/CollaboratorsDetails.noCollaboratorRoles.html')
    })

    it('should correctly display when some collaboratorRoles', async () => {
      const collaboratorRoleMock = getCollaboratorRoleMock()
      const collaboratorRolesMock = [collaboratorRoleMock]
      const functionId = collaboratorRoleMock.functionId
      const subscriptionContactMock1 = getSubscriptionContactMock({ functionId })
      const subscriptionContactMock2 = getSubscriptionContactMock({
        firstName: 'John',
        lastName: 'Doe',
        contactId: subscriptionContactMock1.contactId + 1,
      })
      const subscriptionContactMocks = [
        subscriptionContactMock1,
        subscriptionContactMock2,
      ]
      const wrapper = createWrapper(subscriptionContactMocks, collaboratorRolesMock)

      await expect(wrapper.html()).toMatchFileSnapshot('__snap__/CollaboratorsDetails.withCollaboratorRoles.html')
    })
  })
})
