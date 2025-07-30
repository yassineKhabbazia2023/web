import { AmplitudeOperationStatus, TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'

export function getTrackStartedApprovalEventProperty(
  trackingLocalisation: TrackingLocalisation,
) {
  return {
    registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
    registry_validation_start_localisation: trackingLocalisation,
  }
}

export function getTrackStartedRejectionEventProperty(
  trackingLocalisation: TrackingLocalisation,
) {
  return {
    registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
    registry_validation_start_localisation: trackingLocalisation,
  }
}

export function getTrackCompletedApprovalEventProperty(
  trackingLocalisation: TrackingLocalisation,
) {
  return {
    registry_validation_start_localisation: trackingLocalisation,
    registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
  }
}

export function getTrackCompletedRejectionEventProperty(
  trackingLocalisation: TrackingLocalisation,
  reasonForRefusal?: string,
) {
  return {
    registry_validation_reason: reasonForRefusal,
    registry_validation_start_localisation: trackingLocalisation,
    registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
  }
}
