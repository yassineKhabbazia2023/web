import { useDebounceFn } from '@vueuse/core'
import { DEBOUNCE_TIMING } from '../constants'

export function useDebounce<T extends(...args: any[]) => void>(fn: T, delay: number = DEBOUNCE_TIMING.DEFAULT) {
  return useDebounceFn(fn, delay)
}
