import { describe, it, expect, vi } from 'vitest'
import { API_PREFIXES } from '@entities/common/config/services'
import type { OnboardingDetails } from '@entities/pages/wallet/pages/folders/components/EntityCreatorDrawer/entity-creator-drawer.types'
import { createTestAccount } from '.'

export const mockOnboardingDetails: OnboardingDetails = {
  accountNumber: '1111111',
  accountLegalName: 'Test Account 1',
  email: 'test@test.com',
  contactFirstName: 'Alice',
  contactLastName: 'Bob',
  signatory: true,
  collaboratorGuids: ['guid-1', 'guid-2', 'guid-3'],
}

const entityCreatorPostMock = vi.fn()
vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      post: entityCreatorPostMock,
    },
  }),
}))

describe('entity-creator service', () => {
  describe('createTestAccount', () => {
    it('should make an API call to the correct endpoint', async () => {
      await createTestAccount(mockOnboardingDetails)

      expect(entityCreatorPostMock).toHaveBeenCalledWith(
        `${API_PREFIXES.ENTITY_CREATOR}/Onboarding`,
        mockOnboardingDetails,
      )
    })
  })
})
