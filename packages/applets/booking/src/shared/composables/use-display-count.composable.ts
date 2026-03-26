import { computed, type Ref } from 'vue'

/**
 * Format a count value for display, capping at 99+
 * @param count - The count value to format
 * @returns A formatted string representation of the count
 */
export function useDisplayCount(count: Ref<number>) {
  const displayCount = computed(() => {
    const value = count.value
    return value > 99 ? '99+' : value.toString()
  })

  return {
    displayCount,
  }
}
