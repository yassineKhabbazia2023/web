import type { AiSearchHistoryUser, SubFeatureType } from '@backoffice/types/ai-monitoring.type'
import { AppColors } from '@pulse/styleguide'
import {
  formatCost,
  formatDurationInSeconds,
  getEvaluationColor,
  getEvaluationIcon,
  getSubFeatureColor,
  getSubFeatureIcon,
  getUserFullName,
  hasUserFullName,
} from './ai-monitoring-table.utils'

describe('ai-monitoring-table.utils', () => {
  describe('getSubFeatureIcon', () => {
    it.each<[SubFeatureType, string]>([
      ['Recherche', 'search'],
      ['Explication', 'questionCircle'],
      ['Vente', 'currencyEuro'],
      ['Autres', 'threeDots'],
    ])('should return "%s" icon for sub-feature "%s"', (subFeature, expectedIcon) => {
      expect(getSubFeatureIcon(subFeature)).toBe(expectedIcon)
    })

    it('should return default icon for unknown sub-feature', () => {
      const unknownSubFeature = 'Unknown' as SubFeatureType
      expect(getSubFeatureIcon(unknownSubFeature)).toBe('chatSquareDots')
    })
  })

  describe('getSubFeatureColor', () => {
    it.each<[SubFeatureType, string]>([
      ['Recherche', 'light-green'],
      ['Explication', 'light-blue'],
      ['Vente', 'purple'],
      ['Autres', 'tranquil'],
    ])('should return "%s" color for sub-feature "%s"', (subFeature, expectedColor) => {
      expect(getSubFeatureColor(subFeature)).toBe(expectedColor)
    })

    it('should return default color for unknown sub-feature', () => {
      const unknownSubFeature = 'Unknown' as SubFeatureType
      expect(getSubFeatureColor(unknownSubFeature)).toBe('light-gray')
    })
  })

  describe('hasUserFullName', () => {
    it.each<[string | null, string | null, boolean]>([
      ['John', 'Doe', true],
      [null, 'Doe', false],
      ['John', null, false],
      [null, null, false],
    ])('should return %s for first_name="%s" and last_name="%s"', (firstName, lastName, expected) => {
      const user: AiSearchHistoryUser = {
        email: 'test@example.com',
        first_name: firstName,
        last_name: lastName,
      }
      expect(hasUserFullName(user)).toBe(expected)
    })
  })

  describe('getUserFullName', () => {
    it.each<[string | null, string | null, string]>([
      ['John', 'Doe', 'John Doe'],
      [null, 'Doe', ''],
      ['John', null, ''],
      [null, null, ''],
    ])('should return "%s" for first_name="%s" and last_name="%s"', (firstName, lastName, expected) => {
      const user: AiSearchHistoryUser = {
        email: 'test@example.com',
        first_name: firstName,
        last_name: lastName,
      }
      expect(getUserFullName(user)).toBe(expected)
    })
  })

  describe('formatCost', () => {
    it.each<[number, string]>([
      [0.1234, '0.1234 €'],
      [1, '1.0000 €'],
      [0.12345, '0.1235 €'],
      [0, '0.0000 €'],
    ])('should format %s as "%s"', (cost, expected) => {
      expect(formatCost(cost)).toBe(expected)
    })
  })

  describe('formatDurationInSeconds', () => {
    it.each<[number, string]>([
      [1.234, '1.23'],
      [5, '5.00'],
      [1.999, '2.00'],
      [0, '0.00'],
    ])('should format %s as "%s"', (duration, expected) => {
      expect(formatDurationInSeconds(duration)).toBe(expected)
    })
  })

  describe('getEvaluationIcon', () => {
    it('should return thumbsUp icon for positive evaluation', () => {
      expect(getEvaluationIcon(true)).toBe('thumbsUp')
    })

    it('should return thumbsDown icon for negative evaluation', () => {
      expect(getEvaluationIcon(false)).toBe('thumbsDown')
    })
  })

  describe('getEvaluationColor', () => {
    it('should return success color for positive evaluation', () => {
      expect(getEvaluationColor(true)).toBe(AppColors.ICON_SUCCESS)
    })

    it('should return error color for negative evaluation', () => {
      expect(getEvaluationColor(false)).toBe(AppColors.ICON_ERROR)
    })
  })
})
