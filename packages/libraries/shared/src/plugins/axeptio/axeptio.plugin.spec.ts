import { initAxeptio, openAxeptioCookies } from './axeptio.plugin'

declare let window: {
  axeptioSettings: any
  openAxeptioCookies: any
} & Window

vi.mock('@pulse/toolbox', () => ({
  logger: {
    trace: vi.fn(),
  },
}))

vi.mock('env-vars', () => ({
  VITE_AXEPTIO_KEY: 'test-client-id',
}))

describe('axeptio.plugin', () => {
  describe('initAxeptio', () => {
    it('should set axeptioSettings with clientId', () => {
      initAxeptio()

      expect(window.axeptioSettings).toEqual({ clientId: 'test-client-id' })
    })

    it('should create and insert a script element', () => {
      const insertBeforeMock = vi.fn()
      const fakeScript = { parentNode: { insertBefore: insertBeforeMock } }
      vi.spyOn(document, 'getElementsByTagName').mockReturnValue([fakeScript] as any)
      const createdElement = { async: false, src: '' } as any
      vi.spyOn(document, 'createElement').mockReturnValue(createdElement)

      initAxeptio()

      expect(createdElement.async).toBe(true)
      expect(createdElement.src).toBe('//static.axept.io/sdk.js')
      expect(insertBeforeMock).toHaveBeenCalledWith(createdElement, fakeScript)
    })

    it('should not throw if no script elements exist', () => {
      vi.spyOn(document, 'getElementsByTagName').mockReturnValue([] as any)

      expect(() => initAxeptio()).not.toThrow()
    })
  })

  describe('openAxeptioCookies', () => {
    it('should call window.openAxeptioCookies when it is a function', () => {
      window.openAxeptioCookies = vi.fn()

      openAxeptioCookies()

      expect(window.openAxeptioCookies).toHaveBeenCalled()
    })

    it('should not throw when window.openAxeptioCookies is not a function', () => {
      window.openAxeptioCookies = undefined

      expect(() => openAxeptioCookies()).not.toThrow()
    })
  })
})
