import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { getTrackStartedEventProperty, getTrackCompletedEventProperty, getLegalName } from './PendingOperations.utils'
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

describe('getLegalName', () => {
  const operationMock = getMockedOperations()[0]
  const operationMockWithoutLegalName = {
    ...operationMock,
    legalName: undefined,
  }
  const selectedEntityLegalNameMock = 'selectedEntity legal name'

  const tests = [{
    selectedOperation: operationMock,
    selectedEntityLegalName: selectedEntityLegalNameMock,
    expected: operationMock.legalName,
    reason: 'selectedOperation has a legalName',
  }, {
    selectedOperation: operationMockWithoutLegalName,
    selectedEntityLegalName: selectedEntityLegalNameMock,
    expected: selectedEntityLegalNameMock,
    reason: 'selectedOperation has NO legalName',
  }, {
    selectedOperation: undefined,
    selectedEntityLegalName: selectedEntityLegalNameMock,
    expected: selectedEntityLegalNameMock,
    reason: 'selectedOperation is undefined',
  }, {
    selectedOperation: undefined,
    selectedEntityLegalName: undefined,
    expected: '',
    reason: 'selectedEntityLegalName is undefined',
  }]
  it.each(tests)(
    'should return $expected when $reason',
    ({ selectedOperation, selectedEntityLegalName, expected }) => {
      const result = getLegalName(selectedOperation, selectedEntityLegalName)
      expect(result).toEqual(expected)
    },
  )
})
