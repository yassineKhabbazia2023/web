import { FeatureFlagManager } from '@pulse/common/managers'
import { ProviderName } from '@entities/enums'

import { OfferProviderProductsManager } from './offer-provider-products.manager'

describe('OfferProviderProductsManager', () => {
  describe('hasHeader', () => {
    it('should hide the Pennylane provider header when the monthly note flag is on', () => {
      vi.spyOn(FeatureFlagManager, 'isMonthlyNoteActivated').mockReturnValue(true)

      expect(OfferProviderProductsManager.hasHeader(ProviderName.PENNYLANE)).toBe(false)
    })

    it('should keep the Pennylane provider header when the monthly note flag is off', () => {
      vi.spyOn(FeatureFlagManager, 'isMonthlyNoteActivated').mockReturnValue(false)

      expect(OfferProviderProductsManager.hasHeader(ProviderName.PENNYLANE)).toBe(true)
    })

    it('should keep the header of other providers when the monthly note flag is on', () => {
      vi.spyOn(FeatureFlagManager, 'isMonthlyNoteActivated').mockReturnValue(true)

      expect(OfferProviderProductsManager.hasHeader(ProviderName.MEG)).toBe(true)
    })
  })
})
