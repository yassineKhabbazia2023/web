import { AmplitudeEvent, AmplitudeFeatureName } from '../../enums/amplitude.enums'
import { TrackingCenter } from './tracking-center'

const trackMock = vi.hoisted(() => vi.fn())

vi.mock('./amplitude.service', () => ({
  AmplitudeService: {
    track: trackMock,
  },
}))

describe('TrackingCenter', () => {
  it('trackHomepageConsulted should track Feature Consulted with homepage', () => {
    TrackingCenter.trackHomepageConsulted()

    expect(trackMock).toHaveBeenCalledExactlyOnceWith(
      AmplitudeEvent.FEATURE_CONSULTED,
      { feature_name: AmplitudeFeatureName.HOMEPAGE },
    )
  })
})
