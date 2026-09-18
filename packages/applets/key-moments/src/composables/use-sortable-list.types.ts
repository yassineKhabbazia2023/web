/**
 * A drop, said in the terms of the document rather than in those of the DOM:
 * which item moved, out of which list, into which one, and where.
 */
export interface SortableMoveEvent {
  itemId: string
  toListId: string | undefined
  newIndex: number
}

export interface SortableListOptions {
  /** Lists sharing a group exchange their items */
  group?: string
  /** Selector of the element a drag starts from */
  handle: string
  onMove: (event: SortableMoveEvent) => void
}
