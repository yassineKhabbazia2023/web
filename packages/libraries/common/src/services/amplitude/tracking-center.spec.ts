import { AmplitudeEvent, AmplitudeFeatureName } from '../../enums/amplitude.enums'
import { AmplitudeService } from './amplitude.service'
import { TrackingCenter } from './tracking-center'

describe('TrackingCenter', () => {
  it('trackHomepageConsulted should track Feature Consulted with homepage', () => {
    const trackSpy = vi.spyOn(AmplitudeService, 'track').mockImplementation(() => {})

    TrackingCenter.trackHomepageConsulted()

    expect(trackSpy).toHaveBeenCalledExactlyOnceWith(
      AmplitudeEvent.FEATURE_CONSULTED,
      { feature_name: AmplitudeFeatureName.HOMEPAGE },
    )
  })
})
