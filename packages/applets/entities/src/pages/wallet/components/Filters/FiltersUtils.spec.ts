import { describe, it } from 'vitest'
import { getMockedFilterLabels, getMockedEntitiesStatistics } from './FiltersMocks'
import { getFilters } from './FiltersUtils'

describe('test FiltersUtils', () => {
  describe('getFilters', () => {
    it('should return proper filter list', () => {
      const mockedFilterLabels = getMockedFilterLabels()
      const entitiesStatistics = getMockedEntitiesStatistics()

      const filters = getFilters(mockedFilterLabels, entitiesStatistics)
      expect(filters).toMatchFileSnapshot('__snap__/FiltersUtils/getFilters/filters.snap')
    })
  })
})
