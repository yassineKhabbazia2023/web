import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { HistoryTrackingManager } from './history-tracking.manager'

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

describe('HistoryTrackingManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('trackFilterValidated', () => {
    it('should track History Filter Validated event without properties', () => {
      HistoryTrackingManager.trackFilterValidated()

      expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('History Filter Validated')
    })
  })
})
