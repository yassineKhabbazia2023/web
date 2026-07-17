import { builtinEnvironments } from 'vitest/runtime'
import type { Environment } from 'vitest/runtime'

// jsdom, plus one guarantee: `requestAnimationFrame` always resolves — including
// in the window between two test files.
//
// Why this exists. element-plus debounces el-table's `doLayout` by 50ms and never
// cancels it (it has no unmount hook), so a table mounted late in a file leaves a
// real pending timer behind. Vitest tears the jsdom environment down at the end of
// every file and `delete`s each window key it had installed, so when that timer
// finally fires the bare `requestAnimationFrame(syncPosition)` inside doLayout hits
// a global that no longer exists. The resulting unhandled ReferenceError fails the
// whole run ("Errors 1" → exit 1) even when every single test passed. Since the
// timer belongs to a third party and cannot be cancelled from here, the fix is to
// make the global survive instead of racing it.
//
// How it works. Vitest's teardown does `keys.forEach(delete)` then
// `originals.forEach((v, k) => global[k] = v)`, and `populateGlobal` only records an
// original for a key that ALREADY exists on the global (and belongs to its KEYS
// list — both animation-frame keys do). Seeding the fallbacks here, before jsdom
// populates, therefore makes every teardown restore them rather than leave a hole.
// During the tests themselves the global still resolves to jsdom's real
// implementation, so nothing about test behaviour changes.
//
// The fallbacks drop the frame instead of running the callback: outside a live
// document there is nothing to paint, and that is exactly what a closed window does
// with its pending frames.
const dropAnimationFrame = (): number => 0
const noopCancelAnimationFrame = (): void => undefined

const stableRafEnvironment: Environment = {
  name: 'jsdom-stable-raf',
  viteEnvironment: 'client',
  setup(global, options) {
    global.requestAnimationFrame ??= dropAnimationFrame
    global.cancelAnimationFrame ??= noopCancelAnimationFrame

    return builtinEnvironments.jsdom.setup(global, options)
  },
}

export default stableRafEnvironment
