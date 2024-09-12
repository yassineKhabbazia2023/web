import { expect, it, describe, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { SubscriptionContact } from '@/services/subscription'
import { getMockedSubscriptionDetails } from '@/pages/subscriptions/mocks/SubscriptionDetailsMock'
import CollaboratorsDetails from '.'

const mockedSubscriptionCollaborators =
  getMockedSubscriptionDetails().collaborators

vi.mock('@kpmg/common', () => ({
  getInitials: vi.fn(),
}))

const createWrapper = (
  collaborators: SubscriptionContact[],
): VueWrapper<any> => {
  return mount(CollaboratorsDetails, {
    props: {
      collaborators,
    },
  })
}

describe('collaboratorsDetails', () => {
  describe('display', () => {
    it('should correctly display the exact collaborators', () => {
      const wrapper = createWrapper(mockedSubscriptionCollaborators)
      const collaboratorsCards = wrapper.findAllComponents({
        name: 'PUserAction',
      })

      expect(collaboratorsCards).toHaveLength(
        mockedSubscriptionCollaborators.length,
      )
    })
  })
})
