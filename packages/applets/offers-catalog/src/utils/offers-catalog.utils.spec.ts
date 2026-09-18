import { DEFAULT_TAG_PROPS } from '../const/offers-catalog.const'
import { loggerMock } from '@pulse/toolbox/mocks'
import { getOfferMock, getOffersMock } from '../mocks/offers-catalog.service.mocks'

import { getCatalogTagProps, getOfferSearchTerms, getOffersWithSearchTerms } from './offers-catalog.utils'

const offersMock = getOffersMock()

describe('offers-catalog.utils', () => {
  describe('getCatalogTagProps', () => {
    it('should return proper props when tag label is known', () => {
      const catalogTagProps = getCatalogTagProps('Pack')

      expect(loggerMock.error).not.toHaveBeenCalled()
      expect(catalogTagProps).toEqual({ pColor: 'blue' })
    })

    it('should return default props when tag label is unknown', () => {
      const tagLabel = 'unknown'
      const catalogTagProps = getCatalogTagProps(tagLabel)

      const expectedCatalogTagProps = DEFAULT_TAG_PROPS
      const expectedParameters = `tag props not found for label '${tagLabel}'`

      expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith(expectedParameters)
      expect(catalogTagProps).toEqual(expectedCatalogTagProps)
    })
  })

  describe('getOfferSearchTerms', () => {
    const tests = [{
      title: 'Amazing Offer',
      shortDescription: 'limited TIME only',
      tags: [],
      searchKeywords: '',
      priorityTargets: [],
      description: 'concatenated and lowercased search terms when both title and shortDescription are provided',
      expectedSearchTerms: 'amazing offer limited time only',
    }, {
      title: '  Amazing Offer  ',
      shortDescription: ' limited TIME only ',
      tags: [],
      searchKeywords: '',
      priorityTargets: [],
      description: 'trimmed and lowercased search terms when both title and shortDescription have extra spaces',
      expectedSearchTerms: 'amazing offer limited time only',
    }, {
      title: 'Amazing Offer',
      shortDescription: '',
      tags: [],
      searchKeywords: '',
      priorityTargets: [],
      description: 'only the title when shortDescription is empty',
      expectedSearchTerms: 'amazing offer',
    }, {
      title: '',
      shortDescription: 'limited TIME only',
      tags: [],
      searchKeywords: '',
      priorityTargets: [],
      description: 'only the shortDescription when title is empty',
      expectedSearchTerms: 'limited time only',
    }, {
      title: '',
      shortDescription: '',
      tags: [],
      searchKeywords: '',
      priorityTargets: [],
      description: 'an empty string when both title and shortDescription are empty',
      expectedSearchTerms: '',
    }, {
      title: 'Amazing  offer@s',
      shortDescription: 'limited# time$ only%',
      tags: [],
      searchKeywords: '',
      priorityTargets: [],
      description: 'special characters and return concatenated search terms',
      expectedSearchTerms: 'amazing offer s limited time only',
    }, {
      title: 'offer123',
      shortDescription: 'limited456',
      tags: [],
      searchKeywords: '',
      priorityTargets: [],
      description: 'numeric values in title and shortDescription',
      expectedSearchTerms: 'offer123 limited456',
    }, {
      title: 'title',
      shortDescription: 'shot description',
      tags: ['tag1', 'tag2'],
      searchKeywords: 'keyword1 keyword2',
      priorityTargets: ['target1', 'target2'],
      description: 'all fields provided with tags, searchKeywords, and priorityTargets',
      expectedSearchTerms: 'title shot description tag1 tag2 keyword1 keyword2 target1 target2',
    }, {
      title: undefined,
      shortDescription: undefined,
      tags: undefined,
      searchKeywords: undefined,
      priorityTargets: undefined,
      description: 'edge case : all fields are undefined (could be an api response)',
      expectedSearchTerms: '',
    }]
    it.each(tests)('$expectedSearchTerms when $description', ({
      title,
      shortDescription,
      tags,
      searchKeywords,
      priorityTargets,
      expectedSearchTerms,
    }) => {
      const offerMock = getOfferMock({
        title,
        shortDescription,
        tags,
        searchKeywords,
        priorityTargets,
      })
      const searchTerms = getOfferSearchTerms(offerMock)

      expect(searchTerms).toBe(expectedSearchTerms)
    })
  })

  describe('getOffersWithSearchTerms', () => {
    it('should list items properly', () => {
      const expectedSearchTerms = getOfferSearchTerms(offersMock[0])
      const offersWithSearchTerms = getOffersWithSearchTerms(offersMock)

      expect(offersWithSearchTerms[0].id).toBe(offersMock[0].id)
      expect(offersWithSearchTerms[0].searchTerms).toBe(expectedSearchTerms)
      expect(offersWithSearchTerms).toHaveLength(offersMock.length)
    })
  })
})
