import {
  getTrackStartedApprovalEventProperty,
  getTrackStartedRejectionEventProperty,
  getTrackCompletedApprovalEventProperty,
  getTrackCompletedRejectionEventProperty,
} from './PendingOperations.utils'
import { AmplitudeOperationStatus, TrackingLocalisation } from '@entities/enums'

const trackingLocalisationMock = TrackingLocalisation.ENTITY

describe('test PendingOperations.utils', () => {
  describe('getTrackStartedApprovalEventProperty', () => {
    it('should return correct result for approval', () => {
      const expected = {
        registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
        registry_validation_start_localisation: trackingLocalisationMock,
      }

      const result = getTrackStartedApprovalEventProperty(trackingLocalisationMock)
      expect(result).toEqual(expected)
    })
  })

  describe('getTrackStartedRejectionEventProperty', () => {
    it('should return correct result for rejection', () => {
      const expected = {
        registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
        registry_validation_start_localisation: trackingLocalisationMock,
      }

      const result = getTrackStartedRejectionEventProperty(trackingLocalisationMock)
      expect(result).toEqual(expected)
    })
  })

  describe('getTrackCompletedApprovalEventProperty', () => {
    it('should return correct result for approval completion', () => {
      const expected = {
        registry_validation_start_localisation: trackingLocalisationMock,
        registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
      }

      const result = getTrackCompletedApprovalEventProperty(trackingLocalisationMock)
      expect(result).toEqual(expected)
    })
  })

  describe('getTrackCompletedRejectionEventProperty', () => {
    const tests = [
      {
        reasonForRefusal: 'Invalid data',
        expected: {
          registry_validation_reason: 'Invalid data',
          registry_validation_start_localisation: trackingLocalisationMock,
          registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
        },
      },
      {
        reasonForRefusal: undefined,
        expected: {
          registry_validation_reason: undefined,
          registry_validation_start_localisation: trackingLocalisationMock,
          registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
        },
      },
    ]
    it.each(tests)('should return correct result for rejection completion with reason=$reasonForRefusal', ({
      reasonForRefusal,
      expected,
    }) => {
      const result = getTrackCompletedRejectionEventProperty(
        trackingLocalisationMock,
        reasonForRefusal,
      )
      expect(result).toEqual(expected)
    })
  })
})
