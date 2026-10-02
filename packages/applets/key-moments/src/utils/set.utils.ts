/**
 * A copy of the set with the value flipped in or out. A copy rather than the
 * set itself: a `ref` holding a Set only reacts when it is replaced.
 */
export function toggled<T>(values: Set<T>, value: T): Set<T> {
  const next = new Set(values)

  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }

  return next
}

/** A copy of the set with the value, for the same reason as `toggled`. */
export function withValue<T>(values: Set<T>, value: T): Set<T> {
  return new Set([...values, value])
}

/** A copy of the set without the value, for the same reason as `toggled`. */
export function withoutValue<T>(values: Set<T>, value: T): Set<T> {
  const next = new Set(values)

  next.delete(value)

  return next
}
