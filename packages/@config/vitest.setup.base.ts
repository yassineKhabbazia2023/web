import type { Plugin } from 'vue'
import styleguideLibrary from '@pulse/styleguide'
import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'

// Polyfill requestAnimationFrame/cancelAnimationFrame for jsdom/happy-dom environments
// Required by element-plus (e.g. doLayout debounce)
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame =
    (callback: FrameRequestCallback): number => setTimeout(callback, 0) as unknown as number
  globalThis.cancelAnimationFrame = (id: number): void => clearTimeout(id)
}

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
