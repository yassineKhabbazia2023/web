import { APP_VERSION_CHECK_THROTTLE_DELAY_IN_MS, APP_VERSION_RELOAD_STORAGE_KEY } from '../constants/new-version.consts'

type NewVersionModule = typeof import('./new-version.manager')

const CURRENT_BUILD_ID = 'build-current'
const NEW_BUILD_ID = 'build-new'

const mockFetchResponse = (body: unknown, ok = true) => {
  vi.mocked(globalThis.fetch).mockResolvedValue({ ok, json: () => Promise.resolve(body) } as Response)
}

const createSessionStorageStub = (): Pick<Storage, 'getItem' | 'setItem'> => {
  const storedItems = new Map<string, string>()
  return {
    getItem: key => storedItems.get(key) ?? null,
    setItem: (key, value) => {
      storedItems.set(key, value)
    },
  }
}

describe('NewVersionManager', () => {
  let newVersionModule: NewVersionModule
  let documentStub: EventTarget & { visibilityState: DocumentVisibilityState }
  let sessionStorageStub: Pick<Storage, 'getItem' | 'setItem'>

  const dispatchVisibilityChange = (visibilityState: DocumentVisibilityState) => {
    documentStub.visibilityState = visibilityState
    documentStub.dispatchEvent(new Event('visibilitychange'))
  }

  beforeEach(async () => {
    documentStub = Object.assign(new EventTarget(), { visibilityState: 'visible' as DocumentVisibilityState })
    sessionStorageStub = createSessionStorageStub()
    vi.stubEnv('VITE_APP_BUILD_ID', CURRENT_BUILD_ID)
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('document', documentStub)
    vi.stubGlobal('sessionStorage', sessionStorageStub)
    vi.useFakeTimers()
    // The manager keeps its state in static fields: start every test from a fresh module
    vi.resetModules()
    newVersionModule = await import('./new-version.manager')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  describe('getCurrentBuildId', () => {
    it('should return the build id injected at build time', () => {
      expect(newVersionModule.NewVersionManager.getCurrentBuildId()).toBe(CURRENT_BUILD_ID)
    })
  })

  describe('checkForNewVersion', () => {
    it('should fetch app-version.json bypassing the cache', async () => {
      mockFetchResponse({ buildId: CURRENT_BUILD_ID })

      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(globalThis.fetch).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}app-version.json`, { cache: 'no-store' })
    })

    it('should not flag a reload when the published build id is the current one', async () => {
      mockFetchResponse({ buildId: CURRENT_BUILD_ID })

      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(false)
    })

    it('should flag a reload when a new build id is published', async () => {
      mockFetchResponse({ buildId: NEW_BUILD_ID })

      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(true)
    })

    it('should throttle checks to once every 5 minutes', async () => {
      mockFetchResponse({ buildId: CURRENT_BUILD_ID })

      await newVersionModule.NewVersionManager.checkForNewVersion()
      await newVersionModule.NewVersionManager.checkForNewVersion()
      expect(globalThis.fetch).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(APP_VERSION_CHECK_THROTTLE_DELAY_IN_MS)
      await newVersionModule.NewVersionManager.checkForNewVersion()
      expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    })

    it('should not fetch when no build id has been injected', async () => {
      vi.stubEnv('VITE_APP_BUILD_ID', undefined)

      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(globalThis.fetch).not.toHaveBeenCalled()
    })

    it('should ignore unsuccessful responses', async () => {
      mockFetchResponse({ buildId: NEW_BUILD_ID }, false)

      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(false)
    })

    it('should ignore malformed payloads', async () => {
      mockFetchResponse({ buildId: 42 })

      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(false)
    })

    it('should ignore network errors', async () => {
      vi.mocked(globalThis.fetch).mockRejectedValue(new Error('network'))

      await expect(newVersionModule.NewVersionManager.checkForNewVersion()).resolves.toBeUndefined()
      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(false)
    })
  })

  describe('consumeReload', () => {
    it('should allow only one reload per new build id', async () => {
      mockFetchResponse({ buildId: NEW_BUILD_ID })
      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(true)
      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(false)
    })

    it('should not reload when the page has already been reloaded for this build id', async () => {
      sessionStorageStub.setItem(APP_VERSION_RELOAD_STORAGE_KEY, NEW_BUILD_ID)
      mockFetchResponse({ buildId: NEW_BUILD_ID })
      await newVersionModule.NewVersionManager.checkForNewVersion()

      expect(newVersionModule.NewVersionManager.consumeReload()).toBe(false)
    })
  })

  describe('startWatching', () => {
    it('should check for a new version when the tab becomes visible', () => {
      mockFetchResponse({ buildId: CURRENT_BUILD_ID })
      newVersionModule.NewVersionManager.startWatching()

      dispatchVisibilityChange('visible')

      expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    })

    it('should not check for a new version when the tab becomes hidden', () => {
      newVersionModule.NewVersionManager.startWatching()

      dispatchVisibilityChange('hidden')

      expect(globalThis.fetch).not.toHaveBeenCalled()
    })

    it('should not watch when no build id has been injected', () => {
      vi.stubEnv('VITE_APP_BUILD_ID', undefined)
      newVersionModule.NewVersionManager.startWatching()

      dispatchVisibilityChange('visible')

      expect(globalThis.fetch).not.toHaveBeenCalled()
    })
  })
})
