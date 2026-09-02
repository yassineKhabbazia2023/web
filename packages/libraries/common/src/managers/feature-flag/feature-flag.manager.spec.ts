import { type EnvVars, FeatureFlagManager } from './feature-flag.manager'
import { Feature } from '../../enums/feature.enums'
import { OpenFeatureService } from '../../services/open-feature/open-feature.service'

declare let window: {
  EnvVars: EnvVars
} & Window

describe('FeatureFlagManager', () => {
  beforeEach(() => {
    // Stub the property only (window.EnvVars === globalThis.EnvVars in jsdom):
    // replacing the whole window would strip location & co for any module
    // lazily evaluated during these tests.
    vi.stubGlobal('EnvVars', {} as Record<Feature, 'true' | 'false'>)
  })

  const tests: {
    value: 'true' | 'false',
    expected: boolean,
  }[] = [{
    value: 'false',
    expected: false,
  }, {
    value: 'true',
    expected: true,
  }]

  describe.each(tests)(
    'isPennylaneAmendmentFlowActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.PENNYLANE_AMENDMENT_FLOW] = value
        expect(FeatureFlagManager.isPennylaneAmendmentFlowActivated()).toBe(expected)
      })
    })

  describe.each(tests)(
    'isModscreenV2Activated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.MODSCREEN_V2] = value
        expect(FeatureFlagManager.isModscreenV2Activated()).toBe(expected)
      })
    })

  describe('isFavoriteSortActivated', () => {
    it('should delegate to OpenFeatureService.getBooleanValue', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isFavoriteSortActivated()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.FAVORITE_SORT, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      expect(FeatureFlagManager.isFavoriteSortActivated()).toBe(false)
    })
  })

  describe('isDematMailCollectActivated', () => {
    it('should delegate to OpenFeatureService.getBooleanValue', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isDematMailCollectActivated()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.DEMAT_MAIL_COLLECT, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      expect(FeatureFlagManager.isDematMailCollectActivated()).toBe(false)
    })
  })

  describe('isManageWalletMenuActivated', () => {
    it('should delegate to OpenFeatureService.getBooleanValue', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isManageWalletMenuActivated()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.MANAGE_WALLET_MENU, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      expect(FeatureFlagManager.isManageWalletMenuActivated()).toBe(false)
    })
  })

  describe('isHubspotProductFruitsActivated', () => {
    it('should delegate to OpenFeatureService.getBooleanValue', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isHubspotProductFruitsActivated()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.HUBSPOT_PRODUCT_FRUITS, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      expect(FeatureFlagManager.isHubspotProductFruitsActivated()).toBe(false)
    })
  })

  describe('isSerenityRedirectionModalActivated', () => {
    it('should delegate to OpenFeatureService.getBooleanValue', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isSerenityRedirectionModalActivated()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.SERENITY_REDIRECTION_MODAL, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      expect(FeatureFlagManager.isSerenityRedirectionModalActivated()).toBe(false)
    })
  })

  describe('isLegacyVentyaInvoicesAccessActivated', () => {
    it('should delegate to OpenFeatureService.getBooleanValue', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.LEGACY_VENTYA_INVOICES_ACCESS, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      expect(FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated()).toBe(false)
    })
  })

  describe('isWalletV2Activated', () => {
    it('should delegate to OpenFeatureService.getBooleanValue', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isWalletV2Activated()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.WALLET_V2, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      expect(FeatureFlagManager.isWalletV2Activated()).toBe(false)
    })
  })

  describe('isElectronicAddressAvailable', () => {
    it('should delegate to OpenFeatureService.getBooleanValue for ELECTRONIC_ADDRESS_AVAILABLE', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isElectronicAddressAvailable()

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.ELECTRONIC_ADDRESS_AVAILABLE, false)
      expect(result).toBe(true)
    })

    it('should return false for ELECTRONIC_ADDRESS_AVAILABLE when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      const result = FeatureFlagManager.isElectronicAddressAvailable()

      expect(result).toBe(false)
    })
  })

  describe('isFeatureActivated with OpenFeature flag', () => {
    it('should delegate to OpenFeatureService.getBooleanValue for PROSPECT_EXPERIENCE', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(true)

      const result = FeatureFlagManager.isFeatureActivated(Feature.PROSPECT_EXPERIENCE)

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.PROSPECT_EXPERIENCE, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.spyOn(OpenFeatureService, 'getBooleanValue').mockReturnValue(false)

      const result = FeatureFlagManager.isFeatureActivated(Feature.PROSPECT_EXPERIENCE)

      expect(result).toBe(false)
    })
  })
})
