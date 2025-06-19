import { describe, it, expect, vi } from 'vitest'
import { type EnvVars, FeatureFlagManager } from './feature-flag.manager'
import { Feature } from '../enums/feature.enums'

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
    'isScheduleActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.SCHEDULE] = value
        expect(FeatureFlagManager.isScheduleActivated()).toBe(expected)
      })
    })

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
    'isAccessManagementGlobalActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.ACCESS_MANAGEMENT_GLOBAL] = value
        expect(FeatureFlagManager.isAccessManagementGlobalActivated()).toBe(expected)
      })
    })

  describe.each(tests)(
    'isHomepageWidgetsActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.HOMEPAGE_WIDGETS] = value
        expect(FeatureFlagManager.isHomepageWidgetsActivated()).toBe(expected)
      })
    })

  describe('isFeatureActivated', () => {
    it('should return true if HOMEPAGE_WIDGETS feature is activated', () => {
      window.EnvVars[Feature.HOMEPAGE_WIDGETS] = 'true'
      expect(FeatureFlagManager.isFeatureActivated(Feature.HOMEPAGE_WIDGETS)).toBe(true)
    })

    it('should return false if HOMEPAGE_WIDGETS feature is not activated', () => {
      window.EnvVars[Feature.HOMEPAGE_WIDGETS] = 'false'
      expect(FeatureFlagManager.isFeatureActivated(Feature.HOMEPAGE_WIDGETS)).toBe(false)
    })
  })

  describe.each(tests)(
    'isPennylaneActionAdditionalInfoActivated',
    ({
      value,
      expected,
    }) => {
      it('should return $expected when value is $value', () => {
        window.EnvVars[Feature.PENNYLANE_RIGHT_INFOS] = value
        expect(FeatureFlagManager.isPennylaneActionAdditionalInfoActivated()).toBe(expected)
      })
    })
})
