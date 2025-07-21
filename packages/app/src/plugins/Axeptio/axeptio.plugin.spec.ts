import axeptioPlugin from './axeptio.plugin'

declare let window: {
  axeptioSettings: any // Axeptio
} & Window

vi.mock('env-vars', () => ({
  VITE_AXEPTIO_KEY: 'test-client-id',
}))

describe('Axeptio Plugin', () => {
  beforeEach(() => {
    // Reset the window.axeptioSettings before each test
    window.axeptioSettings = {}
  })

  it('should install in PROD environment', () => {
    import.meta.env.PROD = true

    axeptioPlugin.install()

    expect(window.axeptioSettings.clientId).toBeDefined()
  })
  it('should NOT install in environment other than PROD', () => {
    import.meta.env.PROD = false

    axeptioPlugin.install()

    expect(window.axeptioSettings.clientId).toBeUndefined()
  })
})
