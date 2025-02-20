import { commonApi } from '@pulse/common'
import { API_PREFIXES } from '@entities/common/config/services'
import type { OnboardingDetails } from '@entities/pages/wallet/pages/folders/components/EntityCreatorDrawer/entity-creator-drawer.types'

export const createTestAccount = (onboardingDetails: OnboardingDetails) => {
  return commonApi().gateway.post(`${API_PREFIXES.ENTITY_CREATOR}/Onboarding`, onboardingDetails)
}
