import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent } from '@pulse/common/enums'
import { KeyMomentsTracking } from './key-moments.tracking'

describe('KeyMomentsTracking', () => {
  describe('trackDisplayed', () => {
    it('should send the office of the account with the display event', () => {
      KeyMomentsTracking.trackDisplayed('Office Lyon')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        AmplitudeEvent.KEY_MOMENT_DISPLAYED,
        { moment_cle_display_office: 'Office Lyon' },
      )
    })

    /** Omitted, never sent empty: the event still goes out without it. */
    it.each([undefined, ''])('should omit the office property when it is %s', (office) => {
      KeyMomentsTracking.trackDisplayed(office)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        AmplitudeEvent.KEY_MOMENT_DISPLAYED,
        {},
      )
    })
  })
})
