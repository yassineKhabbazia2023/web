import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent } from '@pulse/common/enums'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'

/**
 * What the page tells Amplitude of the client's reading. The hub and the
 * region of the account are not sent yet: the front does not know them, and
 * they will be added once the microservice serves them — omitted until then,
 * never sent empty.
 */
export class KeyMomentsTracking {

  /** One key moment displayed to the client, with the office of its account. */
  static trackDisplayed(officeName: string | undefined): void {
    const properties: Record<string, string> = {}

    if (isNotNullNorEmpty(officeName)) {
      properties.moment_cle_display_office = officeName
    }

    AmplitudeService.track(AmplitudeEvent.KEY_MOMENT_DISPLAYED, properties)
  }
}
