import { afterEach, beforeEach, vi } from 'vitest'
import type { Plugin } from 'vue'
import styleguideLibrary from '@pulse/styleguide'
import { createI18n } from 'vue-i18n'
import { config, disableAutoUnmount, enableAutoUnmount } from '@vue/test-utils'

export interface VitestSetupOptions {
  i18nMessages?: Record<string, any>
  additionalPlugins?: (Plugin | [Plugin, ...unknown[]])[]
}

export function setupVitest(options: VitestSetupOptions = {}): void {
  const {
    i18nMessages,
    additionalPlugins = [],
  } = options

  const i18n = createI18n({
    locale: 'en-US',
    legacy: false,
    missingWarn: false,
    fallbackWarn: false,
    ...(i18nMessages && { messages: i18nMessages }),
  })

  const styleguideParameters = {
    assetsBaseUrl: 'https://www.example.test',
  }

  const plugins: (Plugin | [Plugin, ...unknown[]])[] = [
    i18n,
    [styleguideLibrary, styleguideParameters] as [Plugin, ...unknown[]],
    ...additionalPlugins,
  ]

  config.global.plugins = plugins
}

// Opt-in per-test guards for isolate-safe projects (see the doctrine in
// docs/guidelines/isolate-safe-tests.md): real timers back and the file's
// testing pinia active before every test. Mock hygiene itself (queues
// drained, spy-wrapped modules back to their real implementations) is
// handled by `mockReset: true` in vite.config.base.ts. Call it from the
// project's vitest.setup.ts.
export function setupIsolateSafeGuards(
  options: { withTestingPinia?: boolean, stubI18nIdentity?: boolean } = {},
): void {
  // Wrappers left mounted by a spec keep patching the worker-shared jsdom
  // document while later files run (zombie component trees, e.g. teleported
  // element-plus drawers): unmount them all after each test. Setup files
  // re-run per test file, so the auto-unmount flag is reset before re-arming.
  disableAutoUnmount()
  enableAutoUnmount(afterEach)
  beforeEach(async () => {
    vi.useRealTimers()
    // Both guards below live in the mocks barrel. Skip the (lazy) barrel import
    // entirely when neither is needed — projects without pinia stores (e.g.
    // styleguide) opt out of the testing pinia activation, and the store spies
    // barrel would otherwise drag pinia in.
    if (options.withTestingPinia === false && options.stubI18nIdentity !== true) {
      return
    }
    // Lazy import: the mocks barrel must not be evaluated during setup init — it
    // would require hubbed modules before their factory deps initialize (TDZ).
    const { activateTestingPiniaForCurrentFile, stubUseI18nWithIdentityT } =
      await import('@pulse/common/mocks/vitest')
    if (options.withTestingPinia !== false) {
      activateTestingPiniaForCurrentFile()
    }
    // Projects that spy-wrap vue-i18n's useI18n arm a worker-wide identity `t`
    // default, so specs never assert on translated wording (doctrine: contested-modules,
    // see the useI18n note). Folded here to avoid a duplicated beforeEach in
    // every such project's setup.
    if (options.stubI18nIdentity === true) {
      stubUseI18nWithIdentityT()
    }
  })
}
