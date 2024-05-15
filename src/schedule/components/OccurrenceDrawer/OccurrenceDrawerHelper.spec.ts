import { expect, describe, it } from 'vitest'
import {
  getFrequencyLabel,
  getCreatedByLabel,
  getShortLabel,
  getLongLabel,
} from './OccurrenceDrawerHelper'
import {
  getMockedOccurrence,
  getMockedScheduleOccurrence,
  getMockedTemplateOccurrence,
} from '@/schedule/tests/mocks/Occurrence'

const frequencyLabels: Record<string, string> = {
  Monthly: 'Tous les mois',
}
const mockedOccurrence = getMockedOccurrence()

describe('test OccurrenceDrawerHelper', () => {
  describe('getFrequencyLabel', () => {
    const tests = [{
      occurrence: undefined,
      reason: 'occurrence is undefined',
      expected: '',
    }, {
      occurrence: mockedOccurrence,
      reason: 'occurrence frequency is None',
      expected: '',
    }, {
      occurrence: getMockedOccurrence({
        schedule: getMockedScheduleOccurrence({
          frequency: 'Monthly',
        }),
      }),
      reason: 'occurrence frequency is Monthly',
      expected: `(${frequencyLabels.Monthly})`,
    }]

    it.each(tests)('should return proper frequencyLabel when $reason', ({
      occurrence,
      expected,
    }) => {
      const frequencyLabel = getFrequencyLabel(frequencyLabels, occurrence)
      expect(frequencyLabel).toBe(expected)
    })
  })

  describe('getCreatedByLabel', () => {
    const { createdBy } = mockedOccurrence.schedule
    const tests = [{
      occurrence: undefined,
      reason: 'occurrence is undefined',
      expected: '',
    }, {
      occurrence: mockedOccurrence,
      reason: 'occurrence has createBy user',
      expected: `${createdBy?.firstName} ${createdBy?.lastName}`,
    }]

    it.each(tests)('should return proper createdByLabel when $reason', ({
      occurrence,
      expected,
    }) => {
      const frequencyLabel = getCreatedByLabel(occurrence)
      expect(frequencyLabel).toBe(expected)
    })
  })

  describe('getShortLabel', () => {
    const shortScheduleModelsByKey: Record<string, string> = {
      TVA: 'TVA',
      Bilan: 'Bilan',
    }
    const tests = [{
      occurrence: undefined,
      reason: 'occurrence is undefined',
      expected: '',
    }, {
      occurrence: mockedOccurrence,
      reason: 'occurrence as createBy user',
      expected: 'CRL',
    }]

    it.each(tests)('should return proper shortLabel when $reason', ({
      occurrence,
      expected,
    }) => {
      const shortLabel = getShortLabel(shortScheduleModelsByKey, occurrence)
      expect(shortLabel).toBe(expected)
    })
  })

  describe('getLongLabel', () => {
    const longScheduleModelsByKey: Record<string, string> = {
      TVA: 'taxe sur la valeur ajoutée',
      Bilan: 'Bilan',
    }
    const shortLabel = 'Bilan'
    const mockedBilanOccurrence = getMockedOccurrence({
      template: getMockedTemplateOccurrence({
        typeShort: 'Bilan',
      }),
    })

    const tests = [{
      occurrence: undefined,
      reason: 'occurrence is undefined',
      expected: '',
    }, {
      occurrence: mockedOccurrence,
      reason: 'longLabel is different than shortLabel',
      expected: '(CRL)',
    }, {
      occurrence: mockedBilanOccurrence,
      reason: 'longLabel is shortLabel',
      expected: '',
    }]

    it.each(tests)('should return proper longLabel when $reason', ({
      occurrence,
      expected,
    }) => {
      const longLabel = getLongLabel(longScheduleModelsByKey, shortLabel, occurrence)
      expect(longLabel).toBe(expected)
    })
  })
})
