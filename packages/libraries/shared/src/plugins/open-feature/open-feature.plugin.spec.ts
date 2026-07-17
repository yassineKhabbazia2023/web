import { createFlagOverridesFromMap } from '@configcat/sdk'
import { initOpenFeature } from './open-feature.plugin'
import { OpenFeatureService } from '@pulse/common/services/open-feature'

// '@configcat/sdk' is mocked project-wide (doctrine: shared-hubs): arm the
// shared spy per test.
const mockCreateFlagOverridesFromMap = vi.mocked(createFlagOverridesFromMap)

beforeEach(() => {
  vi.spyOn(OpenFeatureService, 'init').mockResolvedValue(undefined)
  mockCreateFlagOverridesFromMap.mockReturnValue('flag-overrides' as unknown as ReturnType<typeof createFlagOverridesFromMap>)
})

describe('initOpenFeature', () => {
  it('should not init when sdkKey is undefined', async () => {
    await initOpenFeature(undefined)

    expect(OpenFeatureService.init).not.toHaveBeenCalled()
  })

  it('should not init when sdkKey is empty', async () => {
    await initOpenFeature('')

    expect(OpenFeatureService.init).not.toHaveBeenCalled()
  })

  it('should init without dev overrides in production', async () => {
    vi.stubEnv('DEV', false)

    await initOpenFeature('my-sdk-key')

    expect(OpenFeatureService.init).toHaveBeenCalledWith('my-sdk-key', undefined)

    vi.unstubAllEnvs()
  })

  describe('dev overrides', () => {
    it('should load local flag overrides when fetch succeeds', async () => {
      const localFlags = { feature1: true, feature2: false }
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(localFlags),
      }))

      await initOpenFeature('my-sdk-key')

      expect(mockCreateFlagOverridesFromMap).toHaveBeenCalledWith(localFlags, 'localOverRemote')
      expect(OpenFeatureService.init).toHaveBeenCalledWith('my-sdk-key', {
        flagOverrides: 'flag-overrides',
      })

      vi.unstubAllGlobals()
    })

    it('should init without overrides when fetch response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

      await initOpenFeature('my-sdk-key')

      expect(mockCreateFlagOverridesFromMap).not.toHaveBeenCalled()
      expect(OpenFeatureService.init).toHaveBeenCalledWith('my-sdk-key', undefined)

      vi.unstubAllGlobals()
    })

    it('should init without overrides when fetch throws', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

      await initOpenFeature('my-sdk-key')

      expect(OpenFeatureService.init).toHaveBeenCalledWith('my-sdk-key', undefined)

      vi.unstubAllGlobals()
    })
  })
})
