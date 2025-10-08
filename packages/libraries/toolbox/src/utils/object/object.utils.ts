/**
 * Remove falsy values from an object.
 * @param obj The object to clean.
 * @returns A new object without falsy values.
 */
export const removeFalsyValues = (obj: object) =>
  Object.entries(obj).reduce(
    (acc: any, [key, value]) => (value ? ((acc[key] = value), acc) : acc),
    {},
  )
