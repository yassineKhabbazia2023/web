// inspired by https://alexop.dev/posts/how-to-test-vue-composables/
import { createApp, type App, type ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'

export type ComponentWrapper<T> = VueWrapper<ComponentPublicInstance & T>

export function withSetup<T>(composable: () =>T): [T, App] {
  let result:T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })

  app.mount(document.createElement('div'))
  // @ts-ignore
  return [result, app]
}
