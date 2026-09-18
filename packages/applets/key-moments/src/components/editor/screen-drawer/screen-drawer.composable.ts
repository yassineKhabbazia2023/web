import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { TemplateEditorManager } from '@key-moments/managers/template-editor.manager'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { patchRecord } from '@key-moments/utils/patch.utils'
import { slugify } from '@key-moments/utils/slug.utils'

/**
 * Everything the screen drawer writes. As the widget drawer does, it writes
 * onto the copy the store holds for the open drawer and never onto the
 * document: the report, the dirty state and what a version save sends only
 * learn of an edit once it is handed back.
 */
export function useScreenDrawer() {
  const store = useTemplateEditorStore()
  const { selection, rawTemplate, draft, draftIdError, draftError, areIdsEditable } = storeToRefs(store)

  /** The screen as it is being edited, which is the copy and not the document */
  const screen = computed(() => (selection.value?.kind === 'screen' ? draft.value : undefined))

  const title = computed(() => (screen.value?.title as string | undefined) ?? '')

  const subtitle = computed(() => (screen.value?.subtitle as string | undefined) ?? '')

  const id = computed(() => (screen.value?.id as string | undefined) ?? '')

  const isOpen = computed({
    get: () => screen.value !== undefined,
    set: (open: boolean) => {
      if (open === false) {
        cancel()
      }
    },
  })

  /** Closes without handing anything back. */
  function cancel(): void {
    store.cancelDraft()
  }

  /** Hands the copy back to the document, which is what redraws the report. */
  function save(): void {
    store.commitDraft()
  }

  function patch(next: Record<string, unknown>): void {
    if (screen.value === undefined) {
      return
    }

    store.setDraft(patchRecord({ ...screen.value }, next))
  }

  /** The id travels with the title as long as its author has not taken it over. */
  function rename(next: string): void {
    if (rawTemplate.value === undefined || areIdsEditable.value === false) {
      patch({ title: next })

      return
    }

    patch({
      title: next,
      id: TemplateEditorManager.followingId(rawTemplate.value, id.value, title.value, next),
    })
  }

  /** An empty subtitle is no subtitle: the key leaves rather than reading blank. */
  function setSubtitle(next: string): void {
    patch({ subtitle: next === '' ? undefined : next })
  }

  /** Authored freely while the field is being written, slugified on leaving it. */
  function setId(next: string): void {
    patch({ id: next })
  }

  function normalizeId(): void {
    patch({ id: slugify(id.value) })
  }

  return {
    isOpen,
    screen,
    title,
    subtitle,
    id,
    draftIdError,
    draftError,
    areIdsEditable,
    cancel,
    save,
    rename,
    setSubtitle,
    setId,
    normalizeId,
  }
}
