import { type EnvVars, FeatureFlagManager } from './feature-flag.manager'
import { Feature } from '../../enums/feature.enums'

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
})
