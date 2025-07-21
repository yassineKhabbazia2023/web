import gigyaPlugin from './gigya.plugin'

const envVarsMock = vi.hoisted(() => ({
  VITE_GIGYA_KEY: 'test-gigya-key',
  VITE_GIGYA_SSO_ACTIVATED: 'true',
}))

vi.mock('env-vars', () => envVarsMock)

const findGigyaScript = (dom: any) => {
  return dom.querySelector('script[src*="gigya.com"]')
}

describe('Gigya Plugin', () => {
  beforeEach(() => {
    // Clear any existing script elements
    document.head.innerHTML = ''

    // Add a mock first script element (needed to ensure the Gigya script is inserted before it)
    const mockScript = document.createElement('script')
    mockScript.src = 'mock-script.js'
    document.head.appendChild(mockScript)
  })

  it('should install if feature flag is ON and Gigya key exists', () => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'true'
    envVarsMock.VITE_GIGYA_KEY = 'test-gigya-key'

    gigyaPlugin.install()

    const gigyaScript = findGigyaScript(document)
    expect(gigyaScript).not.toBeNull()
  })
  it('should NOT install if feature flag is OFF and Gigya key exists', () => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'false'
    envVarsMock.VITE_GIGYA_KEY = 'test-gigya-key'

    gigyaPlugin.install()

    const gigyaScript = findGigyaScript(document)
    expect(gigyaScript).toBeNull()
  })
  it('should NOT install if Gigya key does not exist', () => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'true'
    envVarsMock.VITE_GIGYA_KEY = ''

    gigyaPlugin.install()

    const gigyaScript = findGigyaScript(document)
    expect(gigyaScript).toBeNull()
  })
})
