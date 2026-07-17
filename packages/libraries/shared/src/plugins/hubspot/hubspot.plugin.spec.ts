import { openHubspot, closeHubspot, initHubspot } from './hubspot.plugin'
import { hubSpotStatus } from './hubspot.plugin.state'
import { logger } from '@pulse/toolbox'

describe('Hubspot Plugin', () => {
  const mockHubSpotConversations = {
    on: vi.fn(),
    widget: {
      load: vi.fn(),
      open: vi.fn(),
      remove: vi.fn(),
    },
  }

  beforeEach(() => {
    hubSpotStatus.isActive = false
    hubSpotStatus.isInitialized = false
    vi.stubGlobal('HubSpotConversations', mockHubSpotConversations)
    vi.clearAllMocks()
  })

  describe('openHubspot()', () => {
    it('should log error and return early if hubspot is not initialized', () => {
      hubSpotStatus.isInitialized = false

      openHubspot()

      expect(logger.error).toHaveBeenCalled()
      expect(mockHubSpotConversations.widget.load).not.toHaveBeenCalled()
      expect(mockHubSpotConversations.widget.open).not.toHaveBeenCalled()
    })

    it('should load and open hubspot widget when initialized', () => {
      hubSpotStatus.isInitialized = true

      openHubspot()

      expect(mockHubSpotConversations.widget.load).toHaveBeenCalledWith({ widgetOpen: true })
      expect(mockHubSpotConversations.widget.open).toHaveBeenCalled()
      expect(logger.trace).toHaveBeenCalled()
    })
  })

  describe('closeHubspot()', () => {
    it('should remove hubspot widget and log trace', () => {
      closeHubspot()

      expect(mockHubSpotConversations.widget.remove).toHaveBeenCalled()
      expect(logger.trace).toHaveBeenCalled()
    })
  })

  describe('initHubspot()', () => {
    it('should return early if hubspot is not active', () => {
      hubSpotStatus.isActive = false
      const onHubspotClose = vi.fn()

      initHubspot({ onHubspotClose })

      expect(hubSpotStatus.isInitialized).toBe(false)
      expect(mockHubSpotConversations.on).not.toHaveBeenCalled()
    })

    it('should log error and return early if window.HubSpotConversations does not exist', () => {
      hubSpotStatus.isActive = true
      vi.stubGlobal('HubSpotConversations', undefined)
      const onHubspotClose = vi.fn()

      initHubspot({ onHubspotClose })

      expect(logger.error).toHaveBeenCalled()
      expect(hubSpotStatus.isInitialized).toBe(false)
    })

    it('should log warning and return early if hubspot is already initialized', () => {
      hubSpotStatus.isActive = true
      hubSpotStatus.isInitialized = true
      const onHubspotClose = vi.fn()

      initHubspot({ onHubspotClose })

      expect(logger.warn).toHaveBeenCalled()
      expect(mockHubSpotConversations.on).not.toHaveBeenCalled()
    })

    it('should initialize hubspot and set up widgetClosed event listener', () => {
      hubSpotStatus.isActive = true
      hubSpotStatus.isInitialized = false
      const onHubspotClose = vi.fn()

      initHubspot({ onHubspotClose })

      expect(mockHubSpotConversations.on).toHaveBeenCalledWith('widgetClosed', expect.any(Function))
      expect(hubSpotStatus.isInitialized).toBe(true)
      expect(logger.trace).toHaveBeenCalled()
    })

    it('should call closeHubspot and onHubspotClose when widgetClosed event is triggered', () => {
      hubSpotStatus.isActive = true
      hubSpotStatus.isInitialized = false
      const onHubspotClose = vi.fn()

      initHubspot({ onHubspotClose })

      const widgetClosedCallback = mockHubSpotConversations.on.mock.calls[0][1]
      widgetClosedCallback()

      expect(mockHubSpotConversations.widget.remove).toHaveBeenCalled()
      expect(onHubspotClose).toHaveBeenCalled()
    })
  })
})
