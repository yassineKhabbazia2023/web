import { AmplitudeOperationStatus, TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'
import type { Operation } from '@entities/common/types/OperationTypes'

export function getTrackStartedEventProperty(
  trackingLocalisation: TrackingLocalisation,
  isRefused: boolean,
) {
  const result = isRefused
    ? AmplitudeOperationStatus.REJECTED
    : AmplitudeOperationStatus.ACCEPTED

  return {
    registry_validation_start_result: result,
    registry_validation_start_localisation: trackingLocalisation,
  }
}

export function getTrackCompletedEventProperty(
  trackingLocalisation: TrackingLocalisation,
  isRefused: boolean,
  reasonForRefusal?: string,
) {
  return isRefused ? {
    registry_validation_reason: reasonForRefusal,
    registry_validation_start_localisation: trackingLocalisation,
    registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
  } : {
    registry_validation_start_localisation: trackingLocalisation,
    registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
  }
}

export function getLegalName(
  selectedOperation?: Operation,
  selectedEntityLegalName?: string,
) {
  return selectedOperation?.legalName ?? selectedEntityLegalName ?? ''
}