import { OpenFeatureService } from '@pulse/common/services/open-feature'
import type { OpenFeatureInitOptions } from '@pulse/common/services/open-feature'

async function loadDevOverrides(): Promise<OpenFeatureInitOptions | undefined> {
  if (import.meta.env.DEV !== true) {
    return undefined
  }

  try {
    const { createFlagOverridesFromMap, OverrideBehaviour } = await import('@configcat/sdk')
    const response = await fetch(`${import.meta.env.BASE_URL}feature-flags.local.json`)
    if (response.ok === false) {
      throw new Error('Local feature flags file not found')
    }
    const localFlags = await response.json()
    return {
      flagOverrides: createFlagOverridesFromMap(localFlags, OverrideBehaviour.LocalOverRemote),
    }
  } catch {
    // No local override file found — using remote flags only
    return undefined
  }
}

export async function initOpenFeature(sdkKey: string | undefined): Promise<void> {
  if (sdkKey === undefined || sdkKey === '') {
    return
  }

  const initOptions = await loadDevOverrides()
  await OpenFeatureService.init(sdkKey, initOptions)
}
