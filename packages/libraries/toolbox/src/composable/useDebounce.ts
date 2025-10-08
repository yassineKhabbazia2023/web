import { useDebounceFn } from '@vueuse/core'

export function useDebounce<T extends(...args: any[]) => void>(fn: T, delay = 300) {
  return useDebounceFn(fn, delay)
}
