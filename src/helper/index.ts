const COLORS = [
  'persian',
  'orange',
  'cyan',
  'amethyste',
  'teal',
  'green',
  'fuschia',
  'gray',
]

/**
 * This helper is created temporarily to generate a random color and will be deleted once the backend is ready
 * @returns string
 */
export const getRandomColor = (index: number) => COLORS[index % COLORS.length]
