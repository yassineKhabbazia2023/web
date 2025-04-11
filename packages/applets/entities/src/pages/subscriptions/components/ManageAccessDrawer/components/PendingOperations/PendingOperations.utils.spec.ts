import { getTrackStartedEventProperty, getTrackCompletedEventProperty } from './PendingOperations.utils'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'

const trackingLocalisationMock = TrackingLocalisation.FOLDER

describe('test PendingOperations.utils', () => {
  describe('getTrackStartedEventProperty', () => {
    const tests = [
      {
        isRefused: false,
        expected: {
          registry_validation_start_result: 'accepté',
          registry_validation_start_localisation: trackingLocalisationMock,
        },
      },
      {
        isRefused: true,
        expected: {
          registry_validation_start_result: 'refusé',
          registry_validation_start_localisation: trackingLocalisationMock,
        },
      },
    ]
    it.each(tests)('should return correct result for isRefused=$isRefused', ({
      isRefused,
      expected,
    }) => {
      const result = getTrackStartedEventProperty(trackingLocalisationMock, isRefused)
      expect(result).toEqual(expected)
    })
  })

  describe('getTrackCompletedEventProperty', () => {
    const tests = [
      {
        isRefused: true,
        reasonForRefusal: 'Invalid data',
        expected: {
          registry_validation_reason: 'Invalid data',
          registry_validation_start_localisation: trackingLocalisationMock,
          registry_validation_start_result: 'refusé',
        },
      },
      {

        isRefused: false,
        reasonForRefusal: undefined,
        expected: {
          registry_validation_start_localisation: trackingLocalisationMock,
          registry_validation_start_result: 'accepté',
        },
      },
    ]
    it.each(tests)('should return correct result for isRefused=$isRefused', ({
      isRefused,
      reasonForRefusal,
      expected,
    }) => {
      const result = getTrackCompletedEventProperty(
        trackingLocalisationMock,
        isRefused,
        reasonForRefusal,
      )
      expect(result).toEqual(expected)
    })
  })
})
