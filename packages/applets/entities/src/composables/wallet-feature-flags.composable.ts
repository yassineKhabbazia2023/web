import { computed } from 'vue'
import { FeatureFlagManager } from '@pulse/common/managers'

export function useWalletFeatureFlags() {
  const isLastActivityFeatureActivated = computed(() =>
    FeatureFlagManager.isLastActivityFeatureActivated(),
  )

  const isLoadMorePaginationActivated = computed(() =>
    FeatureFlagManager.isWalletTableLoadMorePaginationActivated(),
  )

  const isManageWalletMenuActivated = computed(() =>
    FeatureFlagManager.isManageWalletMenuActivated(),
  )

  const isWalletV2Activated = computed(() =>
    FeatureFlagManager.isWalletV2Activated(),
  )

  return {
    isLastActivityFeatureActivated,
    isLoadMorePaginationActivated,
    isManageWalletMenuActivated,
    isWalletV2Activated,
  }
}
