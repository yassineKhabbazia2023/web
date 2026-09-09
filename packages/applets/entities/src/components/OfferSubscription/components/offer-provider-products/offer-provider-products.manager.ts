import { FeatureFlagManager } from '@pulse/common/managers'
import { ProviderName } from '@entities/enums'

export class OfferProviderProductsManager {
  static hasHeader(providerName: ProviderName): boolean {
    if (providerName !== ProviderName.PENNYLANE) {
      return true
    }

    return FeatureFlagManager.isMonthlyNoteActivated() === false
  }
}
