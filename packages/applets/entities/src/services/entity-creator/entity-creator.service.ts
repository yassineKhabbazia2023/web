import { commonApi } from '@pulse/common'
import { API_PREFIXES } from '@pulse/common/constants'
import type { OnboardingDetails } from '@entities/modules/wallet/types'

export const createTestAccount = (onboardingDetails: OnboardingDetails) => {
  return commonApi().gateway.post(`${API_PREFIXES.ENTITY_CREATOR}/Onboarding`, onboardingDetails)
}

export const generateAccountNumber = async (): Promise<string | undefined> => {
  const { data } = await commonApi().gateway.get(`${API_PREFIXES.ENTITY_CREATOR}/AccountInjector/generate-account-number`)

  return data
}
