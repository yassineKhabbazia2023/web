import hubspotPlugin from './hubspot.plugin.install'
import { loadHubspotScript } from './hubspot.plugin'
import { hubSpotStatus } from './hubspot.plugin.state'

describe('Hubspot Plugin Install', () => {
  beforeEach(() => {
    hubSpotStatus.isActive = false
  })

  it('should set isActive to true when installed with isActive true', () => {
    hubspotPlugin.install({} as any, { isActive: true })

    expect(hubSpotStatus.isActive).toBe(true)
  })

  it('should load Hubspot script when installed with isActive true', () => {
    hubspotPlugin.install({} as any, { isActive: true })

    expect(loadHubspotScript).toHaveBeenCalled()
  })

  it('should set isActive to false when installed with isActive false', () => {
    hubspotPlugin.install({} as any, { isActive: false })

    expect(hubSpotStatus.isActive).toBe(false)
  })

  it('should not load Hubspot script when installed with isActive false', () => {
    hubspotPlugin.install({} as any, { isActive: false })

    expect(loadHubspotScript).not.toHaveBeenCalled()
  })
})
