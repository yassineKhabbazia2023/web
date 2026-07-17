import { API_PREFIXES } from '@pulse/common/constants'
import { apiGatewayGetMock, apiGatewayPostMock } from '@pulse/common/mocks/vitest'
import type { OnboardingDetails } from '@entities/modules/wallet/types'
import { createTestAccount, generateAccountNumber } from '.'

export const onboardingDetailsMock: OnboardingDetails = {
  accountNumber: '1111111',
  accountLegalName: 'Test Account 1',
  email: 'test@test.com',
  contactFirstName: 'Alice',
  contactLastName: 'Bob',
  siret: '1111222233334444',
  isSignatory: true,
  collaboratorGuids: ['guid-1', 'guid-2', 'guid-3'],
}

const entityCreatorGetMock = apiGatewayGetMock
const entityCreatorPostMock = apiGatewayPostMock

beforeEach(() => {
  entityCreatorGetMock.mockImplementation(() => Promise.resolve({ data: onboardingDetailsMock.accountNumber }))
})

describe('entity-creator service', () => {
  describe('createTestAccount', () => {
    it('should make an API call to the correct endpoint', async () => {
      await createTestAccount(onboardingDetailsMock)

      expect(entityCreatorPostMock).toHaveBeenCalledWith(
        `${API_PREFIXES.ENTITY_CREATOR}/Onboarding`,
        onboardingDetailsMock,
      )
    })
  })
  describe('generateAccountNumber', () => {
    it('should make an API call to retrieve the generated account number', async () => {
      const data = await generateAccountNumber()

      expect(data).toStrictEqual(onboardingDetailsMock.accountNumber)
      expect(entityCreatorGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.ENTITY_CREATOR}/AccountInjector/generate-account-number`,
      )
    })
  })
})
