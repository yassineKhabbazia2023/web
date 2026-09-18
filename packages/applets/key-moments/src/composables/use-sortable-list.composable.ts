import { insertNodeAt, removeNode, useSortable } from '@vueuse/integrations/useSortable'
import type { MaybeRefOrGetter } from 'vue'
import type Sortable from 'sortablejs'
import type { SortableListOptions, SortableMoveEvent } from './use-sortable-list.types'

const SORTABLE_ANIMATION_MS = 150

/** Reads a drop off the DOM nodes it happened on: `data-item-id`, `data-list-id`. */
export function readMoveEvent(
  event: Pick<Sortable.SortableEvent, 'item' | 'from' | 'to' | 'newIndex'>,
): SortableMoveEvent {
  return {
    itemId: event.item.dataset.itemId ?? '',
    toListId: event.to.dataset.listId,
    newIndex: event.newIndex ?? 0,
  }
}

/**
 * Sortable moves DOM nodes on its own; the lists here are rendered by Vue from
 * the document held in the store. So every drop is undone in the DOM — the node
 * put back where it was, or taken out of the list it landed in — and replayed on
 * the document, which Vue then renders. One source of truth, the way
 * vue-draggable-plus does it.
 */
export function useSortableList(
  element: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: SortableListOptions,
) {
  return useSortable(element, [], {
    group: options.group,
    handle: options.handle,
    animation: SORTABLE_ANIMATION_MS,
    watchElement: true,
    // the placeholder left where the item would land, and the item being carried
    ghostClass: 'key-moments-editor-ghost',
    dragClass: 'key-moments-editor-drag',
    fallbackOnBody: true,
    // reorder inside one list: the node is put back at the index it left, and
    // Vue re-renders the list from the document
    onUpdate: (event) => {
      removeNode(event.item)
      insertNodeAt(event.from, event.item, event.oldIndex ?? 0)
      options.onMove(readMoveEvent(event))
    },
    // move across two lists: the node is only ever taken out of the one it
    // landed in — the list it came from was already re-rendered
    onAdd: (event) => {
      removeNode(event.item)
      options.onMove(readMoveEvent(event))
    },
  })
}
