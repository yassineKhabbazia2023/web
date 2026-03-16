import { type EnvVars, FeatureFlagManager } from './feature-flag.manager'
import { Feature } from '../../enums/feature.enums'
import { OpenFeatureService } from '../../services/open-feature/open-feature.service'

vi.mock('../../services/open-feature/open-feature.service', () => ({
  OpenFeatureService: {
    getBooleanValue: vi.fn(),
  },
}))

declare let window: {
  EnvVars: EnvVars
} & Window

vi.stubGlobal('window', {
  EnvVars: {} as Record<Feature, 'true' | 'false'>,
})

describe('FeatureFlagManager', () => {
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
    'isMailToGedActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.MAIL_TO_GED] = value
        expect(FeatureFlagManager.isMailToGedActivated()).toBe(expected)
      })
    })

  describe.each(tests)(
    'isFeedCenterActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.FEED_CENTER] = value
        expect(FeatureFlagManager.isFeedCenterActivated()).toBe(expected)
      })
    })

  describe.each(tests)(
    'isMailToPennylaneActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.MAIL_TO_PENNYLANE] = value
        expect(FeatureFlagManager.isMailToPennylaneActivated()).toBe(expected)
      })
    })

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

  describe('isFeatureActivated with OpenFeature flag', () => {
    it('should delegate to OpenFeatureService.getBooleanValue for PROSPECT_EXPERIENCE', () => {
      vi.mocked(OpenFeatureService.getBooleanValue).mockReturnValue(true)

      const result = FeatureFlagManager.isFeatureActivated(Feature.PROSPECT_EXPERIENCE)

      expect(OpenFeatureService.getBooleanValue).toHaveBeenCalledWith(Feature.PROSPECT_EXPERIENCE, false)
      expect(result).toBe(true)
    })

    it('should return false when OpenFeatureService returns false', () => {
      vi.mocked(OpenFeatureService.getBooleanValue).mockReturnValue(false)

      const result = FeatureFlagManager.isFeatureActivated(Feature.PROSPECT_EXPERIENCE)

      expect(result).toBe(false)
    })
  })
})
