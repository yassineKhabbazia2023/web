import type { InjectionKey } from 'vue'

/**
 * How a selector asks for a term the vocabulary does not carry yet. Provided by
 * the surface that mounts the creation drawer — one drawer for the whole page,
 * whichever selector opened it — and the callback is what puts the new code on
 * the very line that asked for it.
 *
 * A selector mounted where nothing provides this offers no creation at all.
 */
export const INDICATOR_CREATION_KEY: InjectionKey<
  (onCreated: (code: string) => void) => void
> = Symbol('key-moments-indicator-creation')
