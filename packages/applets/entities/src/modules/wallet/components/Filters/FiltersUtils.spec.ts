import { describe, it } from 'vitest'
import { getMockedFilterLabels, getMockedEntitiesStatistics } from '@entities/__mocks__/filters.mocks'
import { getOnboardingFilters, getUserConnexionFilters } from './FiltersUtils'

describe('test FiltersUtils', () => {
  describe('getOnboardingFilters', () => {
    it('should return proper filter list', async () => {
      const mockedFilterLabels = getMockedFilterLabels()
      const entitiesStatistics = getMockedEntitiesStatistics()

      const filters = getOnboardingFilters(mockedFilterLabels, entitiesStatistics)
      await expect(filters).toMatchFileSnapshot('__snap__/FiltersUtils/getOnboardingFilters.snap')
    })
  })

  describe('getUserConnexionFilters', () => {
    it('should return proper filter list', async () => {
      const mockedFilterLabels = getMockedFilterLabels()
      const entitiesStatistics = getMockedEntitiesStatistics()

      const filters = getUserConnexionFilters(mockedFilterLabels, entitiesStatistics)
      await expect(filters).toMatchFileSnapshot('__snap__/FiltersUtils/getUserConnexionFilters.snap')
    })
  })
})
