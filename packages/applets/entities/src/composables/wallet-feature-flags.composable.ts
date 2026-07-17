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

  return {
    isLastActivityFeatureActivated,
    isLoadMorePaginationActivated,
    isManageWalletMenuActivated,
  }
}
