import { AmplitudeServiceMock, apiGatewayGetMock, getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedUser } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { getMockedAccountResponse, getMockedBIReports, getMockedMonthlyNoteReport } from '@powerbi/__mocks__/bi-report.mocks'
import { useMonthlyNoteTracking } from './monthly-note-tracking.composable'
import { MONTHLY_NOTE_DISPLAY_EVENT } from './monthly-note-tracking.consts'

const userStoreMock = getStoreMock(useUserStore)
const mockMonthlyNoteReport = getMockedMonthlyNoteReport()
const mockOtherReport = getMockedBIReports()[0]

// '@pulse/common/api' and '@pulse/common/services/amplitude' are hubbed worker-wide
// (packages/@config/vitest.setup.hubs.ts): the account fetch and the tracking converge
// on the shared spies armed below.

describe('useMonthlyNoteTracking', () => {
  beforeEach(() => {
    userStoreMock.user = getMockedUser({ isCollab: false })
    apiGatewayGetMock.mockResolvedValue({ data: getMockedAccountResponse() })
  })

  describe('trackMonthlyNoteDisplayed()', () => {
    it('should track the display with the office and the hub of the account', async () => {
      const { trackMonthlyNoteDisplayed } = useMonthlyNoteTracking()

      await trackMonthlyNoteDisplayed(mockMonthlyNoteReport)

      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(MONTHLY_NOTE_DISPLAY_EVENT, {
        note_mensuelle_display_office: 'Alençon',
        note_mensuelle_display_hub: 'Toulouse Midi Pyrénées',
      })
    })

    it('should track the display with empty properties when the account has no office nor hub', async () => {
      apiGatewayGetMock.mockResolvedValue({ data: getMockedAccountResponse({ office: undefined, hub: undefined }) })
      const { trackMonthlyNoteDisplayed } = useMonthlyNoteTracking()

      await trackMonthlyNoteDisplayed(mockMonthlyNoteReport)

      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(MONTHLY_NOTE_DISPLAY_EVENT, {
        note_mensuelle_display_office: '',
        note_mensuelle_display_hub: '',
      })
    })

    it('should still track the display with empty properties when the account cannot be fetched', async () => {
      const fetchError = new Error('network error')
      apiGatewayGetMock.mockRejectedValue(fetchError)
      const { trackMonthlyNoteDisplayed } = useMonthlyNoteTracking()

      await trackMonthlyNoteDisplayed(mockMonthlyNoteReport)

      expect(vi.mocked(logger.error)).toHaveBeenCalledWith(expect.any(String), fetchError)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(MONTHLY_NOTE_DISPLAY_EVENT, {
        note_mensuelle_display_office: '',
        note_mensuelle_display_hub: '',
      })
    })

    it('should fetch the account only once for several displays of the same account', async () => {
      const { trackMonthlyNoteDisplayed } = useMonthlyNoteTracking()

      await trackMonthlyNoteDisplayed(mockMonthlyNoteReport)
      await trackMonthlyNoteDisplayed(mockMonthlyNoteReport)

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.track).toHaveBeenCalledTimes(2)
    })

    it('should not track the display of another report type', async () => {
      const { trackMonthlyNoteDisplayed } = useMonthlyNoteTracking()

      await trackMonthlyNoteDisplayed(mockOtherReport)

      expect(apiGatewayGetMock).not.toHaveBeenCalled()
      expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
    })

    it('should not track the display for a collaborator', async () => {
      userStoreMock.user = getMockedUser({ isCollab: true })
      const { trackMonthlyNoteDisplayed } = useMonthlyNoteTracking()

      await trackMonthlyNoteDisplayed(mockMonthlyNoteReport)

      expect(apiGatewayGetMock).not.toHaveBeenCalled()
      expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
    })
  })
})
