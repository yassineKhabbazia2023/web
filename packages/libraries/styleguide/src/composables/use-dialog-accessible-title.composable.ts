import { computed } from 'vue'
import type { ComputedRef } from 'vue'

type Translate = (key: string, params?: Record<string, unknown>) => string

/**
 * Flattens a two-color dialog title (rendered visually through PDialog's
 * #header slot, with the highlighted portion driven by a `{highlight}`
 * placeholder in the base translation) into a plain string, for PDialog's
 * pTitle prop. That prop still feeds the dialog's aria-label/aria-labelledby,
 * so the accessible name isn't lost when #header overrides the visible title.
 */
export function useDialogAccessibleTitle(
  t: Translate,
  keypath: string,
  highlightKeypath: string,
): ComputedRef<string> {
  return computed(() => t(keypath, { highlight: t(highlightKeypath) }))
}
