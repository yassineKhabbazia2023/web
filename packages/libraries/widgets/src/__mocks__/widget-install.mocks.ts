import type { App } from 'vue'
import type { Mock } from 'vitest'

interface InstallableWidget {
  install: (app: App, options?: unknown) => void
}

// Installs the widget on a bare app mock and returns the `app.component` spy:
// specs assert the widget registered itself under the expected name.
export function installWidgetOnAppMock(widget: InstallableWidget): Mock {
  const appComponentMock = vi.fn()
  const app = { component: appComponentMock } as unknown as App

  widget.install(app, {})

  return appComponentMock
}

// Matcher for the component a widget registers: a real defineAsyncComponent
// wrapper, recognized by its async loader marker.
export function asyncComponentMatcher(): unknown {
  return expect.objectContaining({ __asyncLoader: expect.any(Function) })
}
