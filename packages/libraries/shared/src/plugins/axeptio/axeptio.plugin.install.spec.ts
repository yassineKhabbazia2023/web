import axeptioPlugin from './axeptio.plugin.install'

declare let window: {
  axeptioSettings: any // Axeptio
} & Window

describe('Axeptio Plugin', () => {
  beforeEach(() => {
    // Reset the window.axeptioSettings before each test (restored automatically)
    vi.stubGlobal('axeptioSettings', {})
  })

  it('should install if set as active', () => {
    axeptioPlugin.install({} as any, { isActive: true })

    expect(window.axeptioSettings.clientId).toBeDefined()
  })
  it('should NOT install if NOT set as active', () => {
    axeptioPlugin.install({} as any, { isActive: false })

    expect(window.axeptioSettings.clientId).toBeUndefined()
  })
})
