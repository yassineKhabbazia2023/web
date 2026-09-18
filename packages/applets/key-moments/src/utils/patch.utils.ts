/**
 * Applies a patch to a record without writing what it does not name: a key set
 * to `undefined` is dropped rather than stored as undefined. That is how a
 * whole block — `cards`, `chart`, `hidden` — leaves a document cleanly.
 */
export function patchRecord<T extends Record<string, unknown>>(
  record: T,
  patch: Record<string, unknown>,
): T {
  const next = { ...record } as Record<string, unknown>

  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined) {
      delete next[key]

      return
    }

    next[key] = value
  })

  return next as T
}

/** Moves an item of a list, giving back a new list. */
export function movedInList<T>(list: T[], from: number, to: number): T[] {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)

  return next
}
